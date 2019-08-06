import Convert = require("./index");
import {BuilderOptions} from "../core/ApiDoc2InterfaceBuilder";
import {ApiDoc2InterfaceParameters} from "../core/ApiDoc2Interface";
import * as path from "path";
import * as fs from "fs";

type CLIFlags = Record<keyof typeof Convert.flags, any>;

export class InputParser {

    static requiredParametersKeys = ["source", "output", "name"];
    static configFileName = "apidoc2ts.config.js";

    async parse(flags: Partial<CLIFlags>): Promise<{
        builderOptions: Partial<BuilderOptions>,
        runParameters: ApiDoc2InterfaceParameters,
    }> {
        const configParameters = this.getConfigParameters(flags.config);
        const combinedParameters = Object.assign({}, configParameters, flags);

        this.validateInput(combinedParameters);

        return {
            builderOptions: combinedParameters as BuilderOptions,
            runParameters: combinedParameters as ApiDoc2InterfaceParameters,
        };
    }

    private getConfigParameters(configPath: string | undefined) {
        return configPath
               ? this.readConfigParameters(configPath)
               : this.readConfigParameters(InputParser.configFileName);
    }

    private readConfigParameters(config: string) {
        const configPath = path.join(process.cwd(), config);

        if (!fs.existsSync(configPath)) {
            return {};
        }

        return require(configPath);
    }

    private validateInput(combinedParameters) {
        InputParser.requiredParametersKeys.forEach(key => {
            if (combinedParameters[key]) {
                return;
            }

            throw new Error(`Missing required flag '${key}'`);
        });
    }
}
