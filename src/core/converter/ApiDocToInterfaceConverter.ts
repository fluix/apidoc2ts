import {IApiDocEndpoint} from "../ApiDocInterfaces";
import {ApiDocEndpointParser} from "../parser/ApiDocEndpointParser";
import {InterfaceGenerator} from "../generator/InterfaceGenerator";

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
    requestPrefix: string;
    requestPostfix: string;
    responsePrefix: string;
    responsePostfix: string;
    errorPrefix: string;
    errorPostfix: string;
}

export const converterDefaultOptions = {
    versionResolving: ConverterVersionResolving.ALL,
    requestPrefix: "",
    requestPostfix: "",
    responsePrefix: "",
    responsePostfix: "Response",
    errorPrefix: "",
    errorPostfix: "Error",
};

export class ApiDocToInterfaceConverter {

    constructor(
        private readonly interfaceGenerator: InterfaceGenerator,
        private readonly endpointParser: ApiDocEndpointParser,
        private readonly options: ConverterOptions = converterDefaultOptions,
    ) {
    }

    async convert(apiDocEndpoints: Array<IApiDocEndpoint>): Promise<Array<ConverterResult>> {
        const latestEndpointsVersions = this.getLatestEndpointsVersions(apiDocEndpoints);

        return await Promise.all(apiDocEndpoints.map(async (endpoint) => {
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
        const versionPostfix = this.createVersionPostfix(endpoint, latestEndpointsVersions);

        const {
            requestInterfaceName,
            responseInterfaceName,
            errorInterfaceName,
        } = this.createInterfacesNames(endpoint, versionPostfix);

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

    private createInterfacesNames(endpoint: IApiDocEndpoint, versionPostfix = "") {
        const {
            requestPrefix,
            requestPostfix,
            responsePrefix,
            responsePostfix,
            errorPrefix,
            errorPostfix,
        } = this.options;

        return {
            requestInterfaceName: this.createInterfaceName(endpoint, versionPostfix, requestPrefix, requestPostfix),
            responseInterfaceName: this.createInterfaceName(endpoint, versionPostfix, responsePrefix, responsePostfix),
            errorInterfaceName: this.createInterfaceName(endpoint, versionPostfix, errorPrefix, errorPostfix),
        };
    }

    private createInterfaceName(endpoint: IApiDocEndpoint, versionPostfix, prefix, postfix) {
        return `${prefix}${endpoint.name}${postfix}${versionPostfix}`;
    }

    private createVersionPostfix(
        endpoint: IApiDocEndpoint,
        latestEndpointsVersions: Record<string, string>,
    ) {
        return endpoint.version !== latestEndpointsVersions[endpoint.name]
               ? `_v${endpoint.version}`
               : "";
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
