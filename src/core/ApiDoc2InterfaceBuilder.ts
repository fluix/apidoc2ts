import * as _ from "lodash";
import {ApiDoc2Interface} from "./ApiDoc2Interface";
import {
    ApiDocToInterfaceConverter,
    converterDefaultOptions,
    ConverterOptions,
} from "./converter/ApiDocToInterfaceConverter";
import {InterfaceGenerator} from "./interface-generator/InterfaceGenerator";
import {ApiDocEndpointParser} from "./parser/ApiDocEndpointParser";
import {ApiDocExamplesParser} from "./parser/ApiDocExamplesParser";

export interface BuilderOptions extends ConverterOptions {
    customTypes: Array<string>;
}

export class ApiDoc2InterfaceBuilder {
    build(parameters: Partial<BuilderOptions>): ApiDoc2Interface {
        const generatorOptions = parameters.customTypes || [];
        const converterOptions: ConverterOptions = _.defaults(parameters, converterDefaultOptions);

        const generator = new InterfaceGenerator(generatorOptions);
        const parser = new ApiDocEndpointParser();
        const examplesParser = new ApiDocExamplesParser();
        const converter = new ApiDocToInterfaceConverter(generator, parser, converterOptions, examplesParser);
        return new ApiDoc2Interface(converter);
    }
}
