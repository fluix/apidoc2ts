import {IApiDocEndpoint} from "./ApiDocInterfaces";
import {ApiDocEndpointParser} from "./ApiDocEndpointParser";
import {InterfaceGenerator} from "./InterfaceGenerator";

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

interface ConverterResult {
    metadata: InterfaceMetadata;
    requestInterface: string;
    responseInterface: string;
    errorInterface: string;
}

export class ApiDocToInterfaceConverter {

    constructor(
        private readonly interfaceGenerator: InterfaceGenerator,
        private readonly endpointParser: ApiDocEndpointParser,
    ) {
    }

    async convert(apiDocEndpoints: Array<IApiDocEndpoint>): Promise<Array<ConverterResult>> {
        const newestEndpointsVersions = this.getLatestEndpointsVersions(apiDocEndpoints);

        return await Promise.all(apiDocEndpoints.map(async (endpoint) => {
            return await this.createInterfaces(endpoint, newestEndpointsVersions);
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
        const {createInterface} = this.interfaceGenerator;
        const versionPostfix = this.createVersionPostfix(endpoint, latestEndpointsVersions);

        return {
            metadata: endpoint as InterfaceMetadata,
            requestInterface: await createInterface(
                request,
                this.createInterfaceName(endpoint, versionPostfix),
            ),
            responseInterface: await createInterface(
                response,
                this.createInterfaceName(endpoint, versionPostfix, "Response"),
            ),
            errorInterface: await createInterface(
                error,
                this.createInterfaceName(endpoint, versionPostfix, "Error"),
            ),
        };
    }

    private createInterfaceName(
        endpoint: IApiDocEndpoint,
        versionPostfix = "",
        postfix = "",
        prefix = "",
    ) {
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
}
