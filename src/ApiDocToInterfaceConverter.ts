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

    async convert(apiDocEndpoint: Array<IApiDocEndpoint>): Promise<Array<ConverterResult>> {
        return await Promise.all(apiDocEndpoint.map(async (endpoint) => {
            return await this.createInterfaces(endpoint);
        }));
    }

    private async createInterfaces(endpoint: IApiDocEndpoint): Promise<ConverterResult> {
        const {error, request, response} = this.endpointParser.parseEndpoint(endpoint);
        const {createInterface} = this.interfaceGenerator;

        return {
            metadata: endpoint as InterfaceMetadata,
            requestInterface: await createInterface(request, endpoint.name),
            responseInterface: await createInterface(response, `${endpoint.name}Response`),
            errorInterface: await createInterface(error, `${endpoint.name}Error`),
        };
    }
}
