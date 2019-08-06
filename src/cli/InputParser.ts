import Convert = require("./index");
import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
import {ApiDoc2InterfaceParameters} from "../core/ApiDoc2Interface";
import {BuilderOptions} from "../core/ApiDoc2InterfaceBuilder";

type CLIFlags = Record<keyof typeof Convert.flags, any>;
interface ConfigFlags extends BuilderOptions, ApiDoc2InterfaceParameters {}

export class InputParser {

    static requiredFlagsKeys: Array<keyof CLIFlags> = ["source", "output", "name"];
    static defaultConfigFileName = "apidoc2ts.config.js";

    async parse(flags: Partial<CLIFlags>): Promise<{
        builderOptions: Partial<BuilderOptions>,
        runParameters: ApiDoc2InterfaceParameters,
    }> {
        const configFlags = this.getConfigFlags(flags.config);
        const mappedInputFlags = this.mapInputFlags(flags);
        const combinedFlags = _.defaults(mappedInputFlags, configFlags);

        this.validateInput(combinedFlags);

        return {
            builderOptions: combinedFlags,
            runParameters: combinedFlags,
        };
    }

    private getConfigFlags(source?: string): ConfigFlags {
        const configPath = source || InputParser.defaultConfigFileName;
        return this.readConfigFlags(configPath);
    }

    private readConfigFlags(config: string) {
        const configPath = path.join(process.cwd(), config);

        if (!fs.existsSync(configPath)) {
            throw new Error(`Could not find config file: ${configPath}`);
        }

        return require(configPath);
    }

    private validateInput(combinedParameters) {
        InputParser.requiredFlagsKeys.forEach(key => {
            if (combinedParameters[key]) {
                return;
            }

            throw new Error(`Missing required flag '${key}'`);
        });
    }

    private mapInputFlags(flags: Partial<CLIFlags>): ConfigFlags {
        return {
            customTypes: flags["custom-types"],
            staticPrefix: flags["static-prefix"],
            staticPostfix: flags["static-postfix"],
            requestPrefix: flags["request-prefix"],
            requestPostfix: flags["request-postfix"],
            responsePrefix: flags["response-prefix"],
            responsePostfix: flags["response-postfix"],
            errorPrefix: flags["error-prefix"],
            errorPostfix: flags["error-postfix"],
            versionResolving: flags.version,
            source: flags.source,
            name: flags.name,
            output: flags.output,
            grouping: flags.grouping,
        };
    }
}
