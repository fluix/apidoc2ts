import {IApiDocEndpoint} from "./ApiDocInterfaces";
import {ApiDocEndpoint} from "./ApiDocEndpoint";
import {InterfaceGenerator} from "./InterfaceGenerator";

export interface InterfaceMetadata {
    type: string;
    url: string;
    name: string;
    group: string;
    filename: string;
    version?: string;
    description?: string;
    title?: string;
}

interface ConverterResult {
    metadata: InterfaceMetadata;
    interface: string;
}

export class ApiDocToInterfaceConverter {

    private readonly interfaceGenerator: InterfaceGenerator;

    constructor(customTypes: Array<string> = []) {
        this.interfaceGenerator = new InterfaceGenerator(customTypes);
    }

    async convert(apiDocData: Array<IApiDocEndpoint>): Promise<Array<ConverterResult>> {
        return await Promise.all(apiDocData.map(async (endpoint) => ({
            metadata: endpoint as InterfaceMetadata,
            interface: await this.generateInterface(endpoint, endpoint.name),
        })));
    }

    private async generateInterface(apiDocRequest, interfaceName): Promise<string> {
        const endpoint = new ApiDocEndpoint(apiDocRequest);
        const schema = endpoint.toJsonSchema();
        return await this.interfaceGenerator.createInterface(schema, interfaceName);
    }
}
