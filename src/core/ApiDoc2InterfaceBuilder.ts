import {InterfaceGenerator} from "./generator/InterfaceGenerator";
import {ApiDocEndpointParser} from "./parser/ApiDocEndpointParser";
import {
    ApiDocToInterfaceConverter,
    ConverterOptions,
    ConverterVersionResolving,
} from "./converter/ApiDocToInterfaceConverter";
import {ApiDoc2Interface} from "./ApiDoc2Interface";

export type BuilderOptions = ConverterOptions
    & { customTypes: Array<string> };

export class ApiDoc2InterfaceBuilder {
    build(parameters: Partial<BuilderOptions>): ApiDoc2Interface {
        const generatorOptions = parameters.customTypes || [];
        const converterOptions = {
            versionResolving: parameters.versionResolving || ConverterVersionResolving.LAST,
        };

        const generator = new InterfaceGenerator(generatorOptions);
        const parser = new ApiDocEndpointParser();
        const converter = new ApiDocToInterfaceConverter(generator, parser, converterOptions);
        return new ApiDoc2Interface(converter);
    }
}
