import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";
import {ApiDocToInterfaceConverter, ConverterResult} from "./ApiDocToInterfaceConverter";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export enum ApiDoc2InterfaceExitCode {
    SUCCESS,
    FAIL,
}

export interface ApiDoc2InterfaceResult {
    message: string;
    code: ApiDoc2InterfaceExitCode;
}

export interface ApiDoc2InterfaceParameters {
    source: string;
    output: string;
    name: string;
}

export class ApiDoc2Interface {

    constructor(private readonly converter: ApiDocToInterfaceConverter) {
    }

    async run(args: ApiDoc2InterfaceParameters): Promise<ApiDoc2InterfaceResult> {
        return readFile(args.source, "utf-8")
            .then((fileData) => {
                const apiDocEndpoints = JSON.parse(fileData);
                return this.converter.convert(apiDocEndpoints);
            })
            .then((converterResults) => {
                return this.writeInterfaces(converterResults, args.output, args.name);
            })
            .then(() => {
                return {
                    message: "Successfully generated interfaces",
                    code: ApiDoc2InterfaceExitCode.SUCCESS,
                };
            })
            .catch((err) => {
                return {
                    message: `${err.stack}`,
                    code: ApiDoc2InterfaceExitCode.FAIL,
                };
            });
    }

    private writeInterfaces(converterResults: Array<ConverterResult>, outPath: string, filename: string) {
        const interfaces = this.combineInterfaces(converterResults);
        return writeFile(path.join(outPath, filename), interfaces);
    }

    private combineInterfaces(converterResults: Array<ConverterResult>) {
        return converterResults.map((data) =>
            [
                data.requestInterface,
                data.responseInterface,
                data.errorInterface,
            ].filter(str => str !== "").join("\n"),
        ).join("\n");
    }
}
