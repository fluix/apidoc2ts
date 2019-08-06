import {Command, flags} from "@oclif/command";
import {
    ApiDoc2Interface,
    ApiDoc2InterfaceExitCode,
    ApiDoc2InterfaceGroupingMode,
    ApiDoc2InterfaceResult,
} from "../core/ApiDoc2Interface";
import {ConverterVersionResolving} from "../core/converter/ApiDocToInterfaceConverter";
import chalk from "chalk";
import {ApiDoc2InterfaceBuilder, BuilderOptions} from "../core/ApiDoc2InterfaceBuilder";
import {InputParser} from "./InputParser";

class Convert extends Command {
    static description = "Tool for converting apiDoc documentation to Typescript interfaces";

    static flags = {
        v: flags.version(),
        help: flags.help({char: "h"}),

        config: flags.string({
            char: "c",
        }),
        source: flags.string({
            char: "s",
            description: "Path to the api_data.json",
        }),
        output: flags.string({
            char: "o",
            description: "Path to the output directory",
        }),
        name: flags.string({
            char: "n",
            description: "Name for generated file",
        }),
        grouping: flags.enum({
            char: "g",
            options: [ApiDoc2InterfaceGroupingMode.SINGLE, ApiDoc2InterfaceGroupingMode.URL],
            description: `Change the way to save interfaces
single - save all interfaces into one file
url - save all interfaces to corresponding url paths`,
        }),
        version: flags.enum({
            char: "v",
            options: [ConverterVersionResolving.ALL, ConverterVersionResolving.LAST],
            description: "Which versions should be processed",
        }),
        ["custom-types"]: flags.string({
            char: "t",
            multiple: true,
            description: "List of custom types",
            helpValue: "type1 type2 type3",
        }),
        ["static-prefix"]: flags.string({
            required: false,
            description: "Prefix for all interfaces names",
        }),
        ["static-postfix"]: flags.string({
            required: false,
            description: "Postfix for all interfaces names",
        }),
        ["request-prefix"]: flags.string({
            description: "Prefix for a request interface name",
        }),
        ["request-postfix"]: flags.string({
            description: "Postfix for a request interface name",
        }),
        ["response-prefix"]: flags.string({
            description: "Prefix for a response interface name",
        }),
        ["response-postfix"]: flags.string({
            description: "Postfix for a response interface name",
        }),
        ["error-prefix"]: flags.string({
            description: "Prefix for a error interface name",
        }),
        ["error-postfix"]: flags.string({
            description: "Postfix for a error interface name",
        }),
    };

    async run() {
        const {args, flags: passedFlags} = this.parse(Convert);

        this.parseInput(passedFlags)
            .then(async ({builderOptions, runParameters}) => {
                await this.convert(builderOptions, runParameters);
            })
            .catch(err => {
                this.log(chalk.redBright(err.message));
                this.exit(1);
            });
    }

    private async convert(builderOptions, runParameters) {
        const apiDoc2interface = this.getApiDoc2Interface(builderOptions);
        const result = await apiDoc2interface.run(runParameters);

        if (result.code === ApiDoc2InterfaceExitCode.FAIL) {
            this.onError(result);
        }

        this.onSuccess(result);
    }

    private parseInput(passedFlags) {
        const configParser = new InputParser();
        return configParser.parse(passedFlags);
    }

    private onSuccess(result: ApiDoc2InterfaceResult) {
        this.log(chalk.greenBright(result.message));

        result.warnings.forEach(warning => {
            this.log(`${chalk.bold.yellow("Warning:")} ${chalk.yellow(warning)}`);
        });
    }

    private onError(result: ApiDoc2InterfaceResult) {
        this.log(chalk.redBright("Error while generating interfaces"));
        this.log(chalk.red(result.message));
        this.exit(1);
    }

    private getApiDoc2Interface(builderOptions): ApiDoc2Interface {
        const apiDoc2InterfaceBuilder = new ApiDoc2InterfaceBuilder();
        return apiDoc2InterfaceBuilder.build(builderOptions);
    }
}

export = Convert;
