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

const qtFakeCustomType = {
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

        const schemaCopy = Object.assign({}, schema);
        const inputData = this.createInputData(schemaCopy, name);
        const quicktypeOptions = this.createOptions(inputData);
        const interfaceString = await this.execQuicktypeGenerator(quicktypeOptions);
        return this.removeFakeDefinitions(interfaceString);
    }

    private async execQuicktypeGenerator(quicktypeOptions) {
        const result = await quicktype(quicktypeOptions);
        return result.lines
            .join("\n")
            .replace(new RegExp(/:\s+/), ": ");
    }

    private createInputData(schema: JsonSchema, name: string) {
        this.fillInFakeTypes(schema);

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

    private fillInFakeTypes(schema: JsonSchema) {
        if (this.customTypes.length !== 0) {
            this.includeFakeDefinitions(schema);
            this.replaceCustomTypesWithDefinitions(schema);
        }
    }

    private includeFakeDefinitions(schema: JsonSchema) {
        const fakeDefinitions = {};
        this.customTypes.forEach(type => {
            fakeDefinitions[type] = qtFakeCustomType;
        });
        schema.definitions = Object.assign({}, schema.definitions, fakeDefinitions);
    }

    private replaceCustomTypesWithDefinitions(schema: JsonSchema) {
        if (!schema.properties) {
            return;
        }

        const customProperties = {};
        _.entries(schema.properties).forEach(([propertyKey, property]: [string, JsonSchema]) => {
            if (!property.type) {
                return;
            }

            if (this.customTypes.includes(property.type)) {
                customProperties[propertyKey] = {
                    $ref: `#/definitions/${property.type}`,
                    required: property.required,
                };
            }
        });

        schema.properties = Object.assign({}, schema.properties, customProperties);
    }

    private removeFakeDefinitions(interfaceString: string): string {
        const regexpInterfaceNames = this.customTypes.join("|");
        const regexp = new RegExp(`export interface (${regexpInterfaceNames}) {[^}]*}`);
        return interfaceString.replace(regexp, "");
    }
}
