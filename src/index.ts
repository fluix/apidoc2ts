import {Command, flags} from "@oclif/command";
import {InterfaceGenerator} from "./InterfaceGenerator";
import {ApiDocEndpointParser} from "./ApiDocEndpointParser";
import {ApiDocToInterfaceConverter} from "./ApiDocToInterfaceConverter";
import {ApiDoc2Interface, ApiDoc2InterfaceExitCode, ApiDoc2InterfaceParameters} from "./ApiDoc2Interface";
import chalk from "chalk";

class Convert extends Command {
    static description = "Tool for converting apiDoc documentation to Typescript interfaces";

    static flags = {
        version: flags.version({char: "v"}),
        help: flags.help({char: "h"}),

        source: flags.string({
            char: "s",
            required: true,
            default: "doc/api_data.json",
            description: "Path to the api_data.json",
        }),
        output: flags.string({
            char: "o",
            required: true,
            default: "./",
            description: "Path to the output directory",
        }),
        name: flags.string({
            char: "n",
            required: true,
            default: "interfaces.ts",
            description: "Name for generated file",
        }),
    };

    async run() {
        const {args, flags: passedFlags} = this.parse(Convert);

        const generator = new InterfaceGenerator();
        const parser = new ApiDocEndpointParser();
        const converter = new ApiDocToInterfaceConverter(generator, parser);
        const apiDoc2interface = new ApiDoc2Interface(converter);
        const result = await apiDoc2interface.run(passedFlags as ApiDoc2InterfaceParameters);

        if (result.code === ApiDoc2InterfaceExitCode.FAIL) {
            this.onError(result);
        }

        this.onSuccess(result);
    }

    private onSuccess(result) {
        this.log(chalk.greenBright(result.message));
    }

    private onError(result) {
        this.log(chalk.redBright("Error while generating interfaces"));
        this.log(chalk.red(result.message));
        this.exit(1);
    }
}

export = Convert;
