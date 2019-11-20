import {endpointHasExamples, IApiDocEndpoint} from "../ApiDocInterfaces";
import {ApiDocExamplesParser} from "../endpoint-parser/ApiDocExamplesParser";
import {ApiDocFieldsParser} from "../endpoint-parser/ApiDocFieldsParser";
import {InterfaceGenerator} from "../interface-generator/InterfaceGenerator";

export interface InterfaceMetadata {
    type: string;
    url: string;
    name: string;
    group: string;
    filename: string;
    version: string;
    description?: string;
    title?: string;
}

export interface ConverterResult {
    metadata: InterfaceMetadata;
    requestInterface: string;
    responseInterface: string;
    errorInterface: string;
    warning?: string;
}

export enum ConverterVersionResolving {
    ALL = "all",
    LAST = "last",
}

export enum ConverterMessages {
    SKIP_OLD_ENDPOINT = "Skipping older version",
    INVALID_PARAMETERS = "Parameters are invalid or not present",
    INVALID_PARAMETERS_AND_EXAMPLES = "Endpoint has no parameters nor valid examples",
}

export interface ConverterOptions {
    versionResolving: ConverterVersionResolving;
    staticPrefix: string;
    staticPostfix: string;
    requestPrefix: string;
    requestPostfix: string;
    responsePrefix: string;
    responsePostfix: string;
    errorPrefix: string;
    errorPostfix: string;
    whitelist: Array<string>;
    parseExamples: boolean;
    makeName: (endpoint: IApiDocEndpoint, isLatest: boolean, options: InterfaceNameOptions) => string;
}

function defaultMakeName(endpoint: IApiDocEndpoint, isLatest: boolean, options: InterfaceNameOptions): string {
    const {
        staticPrefix, staticPostfix, prefix, postfix,
    } = options;
    const versionPostfix = isLatest ? "" : `_v${endpoint.version}`;
    return `${staticPrefix}${prefix}${endpoint.name}${postfix}${versionPostfix}${staticPostfix}`;
}

export const converterDefaultOptions: ConverterOptions = {
    versionResolving: ConverterVersionResolving.ALL,
    staticPrefix: "",
    staticPostfix: "",
    requestPrefix: "",
    requestPostfix: "",
    responsePrefix: "",
    responsePostfix: "Response",
    errorPrefix: "",
    errorPostfix: "Error",
    whitelist: [],
    parseExamples: false,
    makeName: defaultMakeName,
};

interface InterfaceNameOptions {
    staticPrefix: string;
    staticPostfix: string;
    prefix: string;
    postfix: string;
}

interface InterfacesNames {
    requestInterfaceName: string;
    responseInterfaceName: string;
    errorInterfaceName: string;
}

export class ApiDocToInterfaceConverter {
    constructor(
        private readonly interfaceGenerator: InterfaceGenerator,
        private readonly endpointParser: ApiDocFieldsParser,
        private readonly options: ConverterOptions = converterDefaultOptions,
        private readonly examplesParser?: ApiDocExamplesParser,
    ) {
    }

    async convert(apiDocEndpoints: Array<IApiDocEndpoint>): Promise<Array<ConverterResult>> {
        const whitelistedEndpoints = this.getWhitelistedEndpoints(apiDocEndpoints);
        const latestEndpointsVersions = this.getLatestEndpointsVersions(whitelistedEndpoints);

        return Promise.all(whitelistedEndpoints.map(async (endpoint) => {
            if (this.shouldSkipEndpointVersion(endpoint, latestEndpointsVersions)) {
                return this.createWarningResult(
                    endpoint,
                    `${ConverterMessages.SKIP_OLD_ENDPOINT} [${endpoint.version}]`,
                );
            }

            const isLatest = endpoint.version === latestEndpointsVersions[endpoint.name];
            return this.createInterfaces(endpoint, isLatest);
        }));
    }

    private async createInterfaces(endpoint: IApiDocEndpoint, isLatest: boolean): Promise<ConverterResult> {
        const interfacesNames = this.createInterfacesNames(endpoint, isLatest);
        const fromParameters = await this.createInterfacesFromParameters(endpoint, interfacesNames);
        const fromExamples = await this.createInterfacesFromExamples(endpoint, interfacesNames);

        const combinedInterfaces = {
            metadata: endpoint,
            requestInterface: fromParameters.requestInterface || fromExamples.requestInterface,
            responseInterface: fromParameters.responseInterface || fromExamples.responseInterface,
            errorInterface: fromParameters.errorInterface || fromExamples.errorInterface,
        };

        if (this.isBlankResult(combinedInterfaces)) {
            const errorMessage = this.getErrorMessage();
            return this.createWarningResult(endpoint, errorMessage);
        }

        return combinedInterfaces;
    }

    private getErrorMessage() {
        return this.shouldParseExamples()
            ? ConverterMessages.INVALID_PARAMETERS_AND_EXAMPLES
            : ConverterMessages.INVALID_PARAMETERS;
    }

    private isBlankResult(result: ConverterResult) {
        return result.requestInterface === ""
               && result.responseInterface === ""
               && result.errorInterface === "";
    }

    private getWhitelistedEndpoints(apiDocEndpoints: Array<IApiDocEndpoint>): Array<IApiDocEndpoint> {
        if (this.options.whitelist.length === 0) {
            return apiDocEndpoints;
        }

        return apiDocEndpoints.filter(endpoint => this.options.whitelist.includes(endpoint.name));
    }

    private getLatestEndpointsVersions(apiDocEndpoints: Array<IApiDocEndpoint>) {
        const latestEndpointsVersions: Record<string, string> = {};
        apiDocEndpoints.forEach((endpoint) => {
            const currentVersion = latestEndpointsVersions[endpoint.name] || endpoint.version;
            latestEndpointsVersions[endpoint.name] = endpoint.version > currentVersion
                ? endpoint.version
                : currentVersion;
        });
        return latestEndpointsVersions;
    }

    private async createInterfacesFromParameters(
        endpoint: IApiDocEndpoint,
        names: InterfacesNames,
    ): Promise<ConverterResult> {
        const {request, response, error} = this.endpointParser.parseEndpoint(endpoint);

        return {
            metadata: endpoint as InterfaceMetadata,
            requestInterface: await this.interfaceGenerator.createInterface(request, names.requestInterfaceName),
            responseInterface: await this.interfaceGenerator.createInterface(response, names.responseInterfaceName),
            errorInterface: await this.interfaceGenerator.createInterface(error, names.errorInterfaceName),
        };
    }

    private async createInterfacesFromExamples(
        endpoint: IApiDocEndpoint,
        names: InterfacesNames,
    ): Promise<ConverterResult> {
        if (!this.options.parseExamples || !this.examplesParser || !endpointHasExamples(endpoint)) {
            return {
                metadata: endpoint,
                requestInterface: "",
                responseInterface: "",
                errorInterface: "",
            };
        }

        return {
            metadata: endpoint,
            requestInterface: await this.examplesParser.parse(endpoint.parameter, names.requestInterfaceName),
            responseInterface: await this.examplesParser.parse(endpoint.success, names.responseInterfaceName),
            errorInterface: await this.examplesParser.parse(endpoint.error, names.errorInterfaceName),
        };
    }

    private shouldParseExamples(): boolean {
        return Boolean(this.options.parseExamples && this.examplesParser);
    }

    private shouldSkipEndpointVersion(
        endpoint: IApiDocEndpoint,
        latestEndpointsVersions: Record<string, string>,
    ): boolean {
        if (this.options.versionResolving !== ConverterVersionResolving.LAST) {
            return false;
        }
        return endpoint.version !== latestEndpointsVersions[endpoint.name];
    }

    private createInterfacesNames(endpoint: IApiDocEndpoint, isLatest: boolean): InterfacesNames {
        const staticOptions = {
            staticPrefix: this.options.staticPrefix,
            staticPostfix: this.options.staticPostfix,
        };

        return {
            requestInterfaceName: this.options.makeName(endpoint, isLatest, {
                ...staticOptions,
                prefix: this.options.requestPrefix,
                postfix: this.options.requestPostfix,
            }),
            responseInterfaceName: this.options.makeName(endpoint, isLatest, {
                ...staticOptions,
                prefix: this.options.responsePrefix,
                postfix: this.options.responsePostfix,
            }),
            errorInterfaceName: this.options.makeName(endpoint, isLatest, {
                ...staticOptions,
                prefix: this.options.errorPrefix,
                postfix: this.options.errorPostfix,
            }),
        };
    }

    private createWarningResult(endpoint: IApiDocEndpoint, message: string) {
        return {
            metadata: endpoint as InterfaceMetadata,
            requestInterface: "",
            responseInterface: "",
            errorInterface: "",
            warning: message,
        };
    }
}
