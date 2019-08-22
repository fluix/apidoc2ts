import {InputData, jsonInputForTargetLanguage, quicktype, TypeScriptTargetLanguage} from "quicktype-core";
import {IApiDocEndpointPart, IApiDocExample} from "../ApiDocInterfaces";
import {removeFieldsAligningSpaces} from "../StringUtils";

export class ApiDocExamplesParser {
    private regex = /\[(?:\[[^[]*}|[^[]*)*]|{(?:{[^{}]*}|[^{}])*}/;

    private rendererOptions = {"just-types": "true"};
    private targetLanguage = new TypeScriptTargetLanguage();

    async parse(name: string, endpointPart?: IApiDocEndpointPart): Promise<string> {
        if (!endpointPart || !endpointPart.examples) {
            return "";
        }

        const samples = this.getExamplesJson(endpointPart.examples);
        const inputData = await this.createInputData(samples, name);
        const quicktypeOptions = this.getQuicktypeOptions(inputData);

        const result = await quicktype(quicktypeOptions);
        const interfaceString = result.lines.join("\n");
        return removeFieldsAligningSpaces(interfaceString);
    }

    private getExamplesJson(examples: Array<IApiDocExample>) {
        return examples.map(example => {
            const match = example.content.match(this.regex);
            return match ? match[0] : "";
        });
    }

    private getQuicktypeOptions(inputData) {
        return {
            inputData,
            lang: this.targetLanguage,
            rendererOptions: this.rendererOptions,
        };
    }

    private async createInputData(samples: Array<string>, name: string) {
        const inputData = new InputData();
        await inputData.addSource("json", {samples, name},
            () => jsonInputForTargetLanguage(this.targetLanguage));
        return inputData;
    }
}
