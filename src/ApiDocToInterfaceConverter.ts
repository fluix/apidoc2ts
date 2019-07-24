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
        const newestEndpointsVersions = this.getNewestEndpointsVersions(apiDocEndpoints);

        return await Promise.all(apiDocEndpoints.map(async (endpoint) => {
            return await this.createInterfaces(endpoint, newestEndpointsVersions);
        }));
    }

    private getNewestEndpointsVersions(apiDocEndpoints: Array<IApiDocEndpoint>) {
        const newestEndpointsVersions = {};
        apiDocEndpoints.forEach((endpoint) => {
            const currentVersion = newestEndpointsVersions[endpoint.name] || endpoint.version;
            newestEndpointsVersions[endpoint.name] = endpoint.version > currentVersion
                                                     ? endpoint.version
                                                     : currentVersion;
        });
        return newestEndpointsVersions;
    }

    private async createInterfaces(endpoint: IApiDocEndpoint, newestEndpointsVersions: {}): Promise<ConverterResult> {
        const {request, response, error} = this.endpointParser.parseEndpoint(endpoint);
        const {createInterface} = this.interfaceGenerator;
        const versionPostfix = endpoint.version !== newestEndpointsVersions[endpoint.name]
                               ? `v${endpoint.version}`
                               : "";

        return {
            metadata: endpoint as InterfaceMetadata,
            requestInterface: await createInterface(request, `${endpoint.name}${versionPostfix}`),
            responseInterface: await createInterface(response, `${endpoint.name}Response${versionPostfix}`),
            errorInterface: await createInterface(error, `${endpoint.name}Error${versionPostfix}`),
        };
    }
}
