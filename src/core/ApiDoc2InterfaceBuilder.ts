import * as _ from "lodash";
import {ApiDoc2Interface} from "./ApiDoc2Interface";
import {
    ApiDocToInterfaceConverter,
    converterDefaultOptions,
    ConverterOptions,
} from "./endpoint-converter/ApiDocToInterfaceConverter";
import {ApiDocEndpointParser} from "./endpoint-parser/ApiDocEndpointParser";
import {ApiDocExamplesParser} from "./endpoint-parser/ApiDocExamplesParser";
import {InterfaceGenerator} from "./interface-generator/InterfaceGenerator";

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
