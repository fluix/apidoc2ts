import {InterfaceGenerator} from "./generator/InterfaceGenerator";
import {ApiDocEndpointParser} from "./parser/ApiDocEndpointParser";
import {
    ApiDocToInterfaceConverter,
    ConverterOptions,
    converterDefaultOptions,
} from "./converter/ApiDocToInterfaceConverter";
import {ApiDoc2Interface} from "./ApiDoc2Interface";
import * as _ from "lodash";

export interface BuilderOptions extends ConverterOptions {
    customTypes: Array<string>;
}

export class ApiDoc2InterfaceBuilder {
    build(parameters: Partial<BuilderOptions>): ApiDoc2Interface {
        const generatorOptions = parameters.customTypes || [];
        const converterOptions: ConverterOptions = _.defaults(parameters, converterDefaultOptions);

        const generator = new InterfaceGenerator(generatorOptions);
        const parser = new ApiDocEndpointParser();
        const converter = new ApiDocToInterfaceConverter(generator, parser, converterOptions);
        return new ApiDoc2Interface(converter);
    }
}
