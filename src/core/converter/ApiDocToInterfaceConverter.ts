import {IApiDocEndpoint} from "../ApiDocInterfaces";
import {InterfaceGenerator} from "../generator/InterfaceGenerator";
import {ApiDocEndpointParser} from "../parser/ApiDocEndpointParser";

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
};

interface InterfaceNameOptions {
    endpoint: IApiDocEndpoint;
    versionPostfix: string;
    staticPrefix: string;
    staticPostfix: string;
    prefix: string;
    postfix: string;
}

export class ApiDocToInterfaceConverter {

    constructor(
        private readonly interfaceGenerator: InterfaceGenerator,
        private readonly endpointParser: ApiDocEndpointParser,
        private readonly options: ConverterOptions = converterDefaultOptions,
    ) {
    }

    async convert(apiDocEndpoints: Array<IApiDocEndpoint>): Promise<Array<ConverterResult>> {
        const whitelistedEndpoints = this.getWhitelistedEndpoints(apiDocEndpoints);
        const latestEndpointsVersions = this.getLatestEndpointsVersions(whitelistedEndpoints);

        return await Promise.all(whitelistedEndpoints.map(async (endpoint) => {
            if (this.shouldSkipEndpointVersion(endpoint, latestEndpointsVersions)) {
                return this.createWarningResult(endpoint, `Skipping older version [${endpoint.version}]`);
            }

            try {
                return await this.createInterfaces(endpoint, latestEndpointsVersions);
            } catch (error) {
                return this.createWarningResult(endpoint, error.message);
            }
        }));
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

    private async createInterfaces(
        endpoint: IApiDocEndpoint,
        latestEndpointsVersions: Record<string, string>,
    ): Promise<ConverterResult> {
        const {request, response, error} = this.endpointParser.parseEndpoint(endpoint);
        const isLatest = endpoint.version === latestEndpointsVersions[endpoint.name];

        const {
            requestInterfaceName,
            responseInterfaceName,
            errorInterfaceName,
        } = this.createInterfacesNames(endpoint, isLatest);

        return {
            metadata: endpoint as InterfaceMetadata,
            requestInterface: await this.interfaceGenerator.createInterface(request, requestInterfaceName),
            responseInterface: await this.interfaceGenerator.createInterface(response, responseInterfaceName),
            errorInterface: await this.interfaceGenerator.createInterface(error, errorInterfaceName),
        };
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

    private createInterfacesNames(endpoint: IApiDocEndpoint, isLatest: boolean) {
        const commonOptions = {
            endpoint,
            staticPrefix: this.options.staticPrefix,
            staticPostfix: this.options.staticPostfix,
            versionPostfix: isLatest ? "" : `_v${endpoint.version}`,
        };

        return {
            requestInterfaceName: this.createInterfaceName({
                ...commonOptions,
                prefix: this.options.requestPrefix,
                postfix: this.options.requestPostfix,
            }),
            responseInterfaceName: this.createInterfaceName({
                ...commonOptions,
                prefix: this.options.responsePrefix,
                postfix: this.options.responsePostfix,
            }),
            errorInterfaceName: this.createInterfaceName({
                ...commonOptions,
                prefix: this.options.errorPrefix,
                postfix: this.options.errorPostfix,
            }),
        };
    }

    private createInterfaceName(options: InterfaceNameOptions): string {
        const {staticPrefix, staticPostfix, prefix, endpoint, postfix, versionPostfix} = options;
        return `${staticPrefix}${prefix}${endpoint.name}${postfix}${versionPostfix}${staticPostfix}`;
    }

    private createWarningResult(endpoint, message) {
        return {
            metadata: endpoint as InterfaceMetadata,
            requestInterface: "",
            responseInterface: "",
            errorInterface: "",
            warning: message,
        };
    }
}
