import {JsonSchema} from "./JsonSchema";
import * as _ from "lodash";
import {
    InputData,
    JSONSchemaInput,
    JSONSchemaSourceData,
    Options,
    quicktype,
    TypeScriptTargetLanguage,
} from "quicktype-core";

export const quicktypeFakeCustomType = {
    type: "object",
    properties: {
        prop: {},
    },
};

export class InterfaceGenerator {

    private readonly customTypes: Array<string> = [];

    private rendererOptions = {"just-types": "true"};
    private targetLang = new TypeScriptTargetLanguage();

    private qtMakeInput = () => new JSONSchemaInput(undefined);

    constructor(customTypes: Array<string> = []) {
        this.customTypes = customTypes;
    }

    async createInterface(schema: JsonSchema, name = "Generated") {
        if (_.isEmpty(schema)) {
            return "";
        }

        if (this.customTypes.includes(name)) {
            throw new Error(`Interface ${name} exists in custom types: [${this.customTypes.join(",")}]`);
        }

        const inputData = this.createInputData(schema, name);
        const quicktypeOptions = this.createOptions(inputData);
        const interfaceString = await this.execQuicktypeGenerator(quicktypeOptions);
        return this.removeFakeDefinitions(interfaceString);
    }

    private async execQuicktypeGenerator(quicktypeOptions) {
        const result = await quicktype(quicktypeOptions);
        return result.lines.join("");
    }

    private createInputData(schema: JsonSchema, name: string) {
        const schemaString = JSON.stringify(schema);
        const source: JSONSchemaSourceData = {name, schema: schemaString};
        const inputData = new InputData();

        inputData.addSourceSync("schema", source, this.qtMakeInput);
        return inputData;
    }

    private createOptions(inputData: InputData): Partial<Options> {
        return {
            inputData,
            lang: this.targetLang,
            rendererOptions: this.rendererOptions,
        };
    }

    private removeFakeDefinitions(interfaceString: string): string {
        const regexpInterfaceNames = this.customTypes.join("|");
        const regexp = new RegExp(`(export interface (${regexpInterfaceNames}) {[^}]*})`);
        return interfaceString.replace(regexp, "");
    }
}
