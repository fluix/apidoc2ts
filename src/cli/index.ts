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

class Convert extends Command {
    static description = "Tool for converting apiDoc documentation to Typescript interfaces";

    static flags = {
        v: flags.version(),
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
        grouping: flags.enum({
            char: "g",
            required: true,
            options: [ApiDoc2InterfaceGroupingMode.SINGLE, ApiDoc2InterfaceGroupingMode.URL],
            default: ApiDoc2InterfaceGroupingMode.SINGLE,
            description: `Change the way to save interfaces
single - save all interfaces into one file
url - save all interfaces to corresponding url paths`,
        }),
        version: flags.enum({
            char: "v",
            required: true,
            options: [ConverterVersionResolving.ALL, ConverterVersionResolving.LAST],
            default: ConverterVersionResolving.ALL,
            description: "Which versions should be processed",
        }),
        ["custom-types"]: flags.string({
            char: "t",
            required: false,
            multiple: true,
            description: "List of custom types",
            helpValue: "type1 type2 type3",
        }),
        ["request-prefix"]: flags.string({
            required: false,
            description: "Prefix for a request interface name",
        }),
        ["request-postfix"]: flags.string({
            required: false,
            description: "Postfix for a request interface name",
        }),
        ["response-prefix"]: flags.string({
            required: false,
            description: "Prefix for a response interface name",
        }),
        ["response-postfix"]: flags.string({
            required: false,
            description: "Postfix for a response interface name",
        }),
        ["error-prefix"]: flags.string({
            required: false,
            description: "Prefix for a error interface name",
        }),
        ["error-postfix"]: flags.string({
            required: false,
            description: "Postfix for a error interface name",
        }),
    };

    async run() {
        const {args, flags: passedFlags} = this.parse(Convert);

        const apiDoc2interface = this.getApiDoc2Interface(passedFlags);
        const result = await apiDoc2interface.run(passedFlags);

        if (result.code === ApiDoc2InterfaceExitCode.FAIL) {
            this.onError(result);
        }

        this.onSuccess(result);
    }

    private onSuccess(result: ApiDoc2InterfaceResult) {
        this.log(chalk.greenBright(result.message));

        result.warnings.forEach(warning => {
            this.log(`${chalk.yellowBright("Warning:")} ${chalk.yellow(warning)}`);
        });
    }

    private onError(result: ApiDoc2InterfaceResult) {
        this.error(chalk.redBright("Error while generating interfaces"));
        this.error(chalk.red(result.message));
        this.exit(1);
    }

    private getApiDoc2Interface(passedFlags): ApiDoc2Interface {
        const builderOptions = this.createBuilderOptions(passedFlags);
        const apiDoc2InterfaceBuilder = new ApiDoc2InterfaceBuilder();
        return apiDoc2InterfaceBuilder.build(builderOptions);
    }

    private createBuilderOptions(passedFlags: Record<keyof typeof Convert.flags, any>): Partial<BuilderOptions> {
        return {
            versionResolving: (passedFlags.version) as ConverterVersionResolving,
            customTypes: passedFlags["custom-types"],
            requestPrefix: passedFlags["request-prefix"],
            requestPostfix: passedFlags["request-postfix"],
            responsePrefix: passedFlags["response-prefix"],
            responsePostfix: passedFlags["response-postfix"],
            errorPrefix: passedFlags["error-prefix"],
            errorPostfix: passedFlags["error-postfix"],
        };
    }
}

export = Convert;
