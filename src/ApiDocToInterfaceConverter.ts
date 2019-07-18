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
        const results: Array<ConverterResult> = [];

        for (const requestData of apiDocData) {
            const interfaceString = await this.generateInterface(requestData, requestData.name);

            results.push({
                metadata: requestData as InterfaceMetadata,
                interface: interfaceString,
            });
        }

        return results;
    }

    private async generateInterface(apiDocRequest, interfaceName): Promise<string> {
        const endpoint = new ApiDocEndpoint(apiDocRequest);
        const schema = endpoint.toJsonSchema();
        return await this.interfaceGenerator.createInterface(schema, interfaceName);
    }
}
