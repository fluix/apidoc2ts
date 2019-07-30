import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";
import {ApiDocToInterfaceConverter, ConverterResult} from "./ApiDocToInterfaceConverter";
import {filterEmptyStrings, getUrlWithoutParameters} from "./string-utils";
import {InterfaceGenerator} from "./InterfaceGenerator";
import {ApiDocEndpointParser} from "./ApiDocEndpointParser";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export enum ApiDoc2InterfaceExitCode {
    SUCCESS,
    FAIL,
}

export enum ApiDoc2InterfaceGroupingMode {
    SINGLE = "single",
    URL = "url",
}

export interface ApiDoc2InterfaceResult {
    message: string;
    code: ApiDoc2InterfaceExitCode;
    warnings: Array<string>;
}

export interface ApiDoc2InterfaceParameters {
    source: string;
    output: string;
    name: string;
    grouping: ApiDoc2InterfaceGroupingMode;
}

export class ApiDoc2Interface {

    static simple(): ApiDoc2Interface {
        const generator = new InterfaceGenerator();
        const parser = new ApiDocEndpointParser();
        const converter = new ApiDocToInterfaceConverter(generator, parser);
        return new ApiDoc2Interface(converter);
    }

    constructor(private readonly converter: ApiDocToInterfaceConverter) {
    }

    async run(args: ApiDoc2InterfaceParameters): Promise<ApiDoc2InterfaceResult> {
        const warnings: Array<string> = [];
        return readFile(args.source, "utf-8")
            .then((fileData) => {
                const apiDocEndpoints = JSON.parse(fileData);
                return this.converter.convert(apiDocEndpoints);
            })
            .then((converterResults) => {
                this.fillInWarnings(converterResults, warnings);
                return this.writeInterfaces(converterResults, args);
            })
            .then(() => {
                return {
                    warnings,
                    message: "Successfully generated interfaces",
                    code: ApiDoc2InterfaceExitCode.SUCCESS,
                };
            })
            .catch((err) => {
                return {
                    message: `${err}`,
                    code: ApiDoc2InterfaceExitCode.FAIL,
                    warnings: [],
                };
            });
    }

    private fillInWarnings(converterResults: Array<ConverterResult>, warnings: Array<string>) {
        converterResults.forEach(result => {
            if (!result.warning) {
                return;
            }

            warnings.push(`${result.metadata.name}: ${result.warning}`);
        });
    }

    private writeInterfaces(converterResults: Array<ConverterResult>, args: ApiDoc2InterfaceParameters) {
        if (args.grouping === ApiDoc2InterfaceGroupingMode.URL) {
            return this.writeInterfacesIntoUrlsPath(converterResults, args);
        }

        return this.writeInterfacesIntoFile(converterResults, args);
    }

    private writeInterfacesIntoFile(converterResults: Array<ConverterResult>, args: ApiDoc2InterfaceParameters) {
        const interfacesString = this.stringifyAllInterfaces(converterResults);
        const filePath = path.join(args.output, args.name);

        return this.writeFile(filePath, interfacesString);
    }

    private writeInterfacesIntoUrlsPath(converterResults: Array<ConverterResult>, args: ApiDoc2InterfaceParameters) {
        converterResults.forEach(converterResult => {
            const interfacesString = this.stringifyInterfaces(converterResult);

            if (interfacesString.length === 0) {
                return;
            }

            return this.writeInterfaceToUrlPath(converterResult, args, interfacesString);
        });
    }

    private writeInterfaceToUrlPath(converterResult, args: ApiDoc2InterfaceParameters, interfacesString) {
        const urlPath = getUrlWithoutParameters(converterResult.metadata.url);
        const filePath = path.join(args.output, urlPath, `${converterResult.metadata.name}.ts`);

        return this.writeFile(filePath, interfacesString);
    }

    private stringifyAllInterfaces(converterResults: Array<ConverterResult>): string {
        return converterResults
            .map((endpointData) => this.stringifyInterfaces(endpointData))
            .filter(filterEmptyStrings)
            .join("\n");
    }

    private stringifyInterfaces(converterResult: ConverterResult): string {
        return [
            converterResult.requestInterface,
            converterResult.responseInterface,
            converterResult.errorInterface,
        ].filter(filterEmptyStrings).join("\n");
    }

    private writeFile(filePath, interfacesString) {
        fs.mkdirSync(path.dirname(filePath), {recursive: true});
        return writeFile(filePath, interfacesString);
    }
}
