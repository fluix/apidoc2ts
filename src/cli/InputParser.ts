import Convert = require("./Index");
import * as fs from "fs";
import {defaults} from "lodash";
import * as path from "path";
import {ApiDoc2InterfaceGroupingMode, ApiDoc2InterfaceParameters} from "../core/ApiDoc2Interface";
import {BuilderOptions} from "../core/ApiDoc2InterfaceBuilder";

type CLIFlags = Record<keyof typeof Convert.flags, any>;

interface ConfigFlags extends BuilderOptions, ApiDoc2InterfaceParameters {}

export class InputParser {

    static defaultConfigFileName = "apidoc2ts.config.js";

    async parse(cliFlags: Partial<CLIFlags>): Promise<{
        builderOptions: Partial<BuilderOptions>,
        runParameters: ApiDoc2InterfaceParameters,
    }> {
        const flags = cliFlags.config
                      ? await this.readConfigFlags(cliFlags.config)
                      : await this.combineDefaultConfigAndCliFlags(cliFlags);

        if (!flags.source) {
            throw new Error("Missing required flag 'source'");
        }

        if (!flags.name && flags.grouping === ApiDoc2InterfaceGroupingMode.SINGLE) {
            throw new Error("Missing required flag 'name'");
        }

        const runParameters = {
            source: flags.source,
            output: flags.output || "./",
            name: flags.name || "",
            grouping: flags.grouping as ApiDoc2InterfaceGroupingMode,
        };

        return {
            runParameters,
            builderOptions: flags,
        };
    }

    private async combineDefaultConfigAndCliFlags(flags: Partial<CLIFlags>): Promise<Partial<ConfigFlags>> {
        const mappedCliFlags = this.mapInputFlags(flags);

        return this.readConfigFlags(InputParser.defaultConfigFileName)
                   .then(defaultConfigFlags => {
                       return defaults(mappedCliFlags, defaultConfigFlags);
                   })
                   .catch(err => {
                       return mappedCliFlags;
                   });
    }

    private readConfigFlags(config: string): Promise<ConfigFlags> {
        const configPath = path.join(process.cwd(), config);

        if (!fs.existsSync(configPath)) {
            return Promise.reject(new Error(`Could not find config file: ${configPath}`));
        }

        return Promise.resolve(require(configPath));
    }

    private mapInputFlags(flags: Partial<CLIFlags>): Partial<ConfigFlags> {
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
            parseExamples: flags["parse-examples"],
            versionResolving: flags.version,
            source: flags.source,
            name: flags.name,
            output: flags.output,
            grouping: flags.grouping,
            whitelist: flags.whitelist,
        };
    }
}
