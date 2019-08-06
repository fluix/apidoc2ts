import Convert = require("./index");
import {BuilderOptions} from "../core/ApiDoc2InterfaceBuilder";
import {ApiDoc2InterfaceParameters} from "../core/ApiDoc2Interface";
import * as path from "path";
import * as fs from "fs";
import * as _ from "lodash";

type CLIFlags = Record<keyof typeof Convert.flags, any>;
interface ConfigFlags extends BuilderOptions, ApiDoc2InterfaceParameters {}

export class InputParser {

    static requiredFlagsKeys: Array<keyof CLIFlags> = ["source", "output", "name"];
    static configFileName = "apidoc2ts.config.js";

    async parse(flags: Partial<CLIFlags>): Promise<{
        builderOptions: Partial<BuilderOptions>,
        runParameters: ApiDoc2InterfaceParameters,
    }> {
        const configFlags: ConfigFlags = this.getConfigParameters(flags.config);
        const mappedInputFlags: ConfigFlags = this.mapInputFlags(flags);
        const combinedFlags = _.defaults(mappedInputFlags, configFlags);

        this.validateInput(combinedFlags);

        return {
            builderOptions: combinedFlags,
            runParameters: combinedFlags,
        };
    }

    private getConfigParameters(configPath: string | undefined) {
        return configPath
               ? this.readConfigFlags(configPath)
               : this.readConfigFlags(InputParser.configFileName);
    }

    private readConfigFlags(config: string) {
        const configPath = path.join(process.cwd(), config);

        if (!fs.existsSync(configPath)) {
            return {};
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
