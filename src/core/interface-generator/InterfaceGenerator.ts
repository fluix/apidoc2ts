import {cloneDeep, entries, isEmpty} from "lodash";
import {
    InputData,
    JSONSchemaInput,
    JSONSchemaSourceData,
    Options,
    quicktype,
    TypeScriptTargetLanguage,
} from "quicktype-core";
import {JsonSchema, jsonSchemaDefaultTypes, traverseSchemaRecursively} from "../JsonSchema";
import {removeFieldsAligningSpaces} from "../utils/StringUtils";

const qtFakeCustomType = {
    type: "object",
    properties: {
        prop: {},
    },
};

// TODO: refactor methods to not have side effects
/* eslint-disable no-param-reassign */

export default class InterfaceGenerator {
    private readonly customTypes: Array<string> = [];

    private rendererOptions = {"just-types": "true"};
    private targetLang = new TypeScriptTargetLanguage();

    private qtMakeInput = () => new JSONSchemaInput(undefined);

    constructor(customTypes: Array<string> = []) {
        this.customTypes = customTypes;
    }

    async createInterface(schema: JsonSchema, name = "Generated"): Promise<string> {
        if (isEmpty(schema)) {
            return "";
        }

        if (this.customTypes.includes(name)) {
            throw new Error(`Interface ${name} exists in custom types: [${this.customTypes.join(",")}]`);
        }

        const schemaCopy = cloneDeep(schema);
        const inputData = this.createInputData(schemaCopy, name);
        const quicktypeOptions = this.createOptions(inputData);
        const interfaceString = await this.execQuicktypeGenerator(quicktypeOptions);
        return this.removeFakeDefinitions(interfaceString);
    }

    private async execQuicktypeGenerator(quicktypeOptions: Partial<Options>) {
        try {
            const result = await quicktype(quicktypeOptions);
            const interfaceString = result.lines.join("\n");
            return removeFieldsAligningSpaces(interfaceString);
        } catch (err) {
            return "";
        }
    }

    private createInputData(schema: JsonSchema, name: string) {
        this.fillInFakeTypes(schema);
        this.lowercaseDefaultTypes(schema);
        this.replaceInvalidTypesWithStrings(schema);
        this.replaceNumericEnumsWithStringEnums(schema);

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
        if (this.customTypes.length === 0) {
            return;
        }

        this.includeFakeDefinitions(schema);
        this.includeRequiredPropertiesList(schema);
        this.replaceCustomTypesWithReferences(schema);
    }

    private includeFakeDefinitions(schema: JsonSchema) {
        const fakeDefinitions: { [definition: string]: JsonSchema } = {};
        this.customTypes.forEach(type => {
            fakeDefinitions[type] = qtFakeCustomType;
        });
        schema.definitions = {...schema.definitions, ...fakeDefinitions};
    }

    private replaceCustomTypesWithReferences(schema: JsonSchema) {
        const customProperties: { [property: string]: JsonSchema } = {};
        entries(schema.properties).forEach(([propertyKey, property]: [string, JsonSchema]) => {
            if (!property.type) {
                return;
            }

            if (this.customTypes.includes(property.type)) {
                customProperties[propertyKey] = {$ref: `#/definitions/${property.type}`};
            }
        });

        schema.properties = {...schema.properties, ...customProperties};
    }

    private includeRequiredPropertiesList(schema: JsonSchema) {
        const requiredProperties: Array<string> = [];
        entries(schema.properties).forEach(([propertyKey, property]: [string, JsonSchema]) => {
            if (property.required) {
                requiredProperties.push(propertyKey);
            }
        });
        schema.required = Object.assign([], schema.required, requiredProperties);
    }

    private removeFakeDefinitions(interfaceString: string): string {
        const regexpInterfaceNames = this.customTypes.join("|");
        const regexp = new RegExp(`export interface (${regexpInterfaceNames}) {[^}]*}`);
        return interfaceString.replace(regexp, "");
    }

    private lowercaseDefaultTypes(schema: JsonSchema) {
        traverseSchemaRecursively(schema, (subSchema) => {
            if (!subSchema.type || !this.isDefaultType(subSchema)) {
                return;
            }

            subSchema.type = subSchema.type.toLowerCase();
        });
    }

    private replaceInvalidTypesWithStrings(schema: JsonSchema) {
        traverseSchemaRecursively(schema, (subSchema) => {
            if (!this.isInvalidType(subSchema)) {
                return;
            }

            subSchema.description = `Replaced type: ${subSchema.type}`;
            subSchema.type = "string";
        });
    }

    private replaceNumericEnumsWithStringEnums(schema: JsonSchema) {
        traverseSchemaRecursively(schema, subSchema => {
            if (!subSchema.enum || subSchema.type !== "number") {
                return;
            }

            subSchema.type = "string";
            subSchema.enum = subSchema.enum.map(item => item.toString());
        });
    }

    private isDefaultType(subSchema: JsonSchema) {
        return subSchema.type
               && !this.customTypes.includes(subSchema.type)
               && jsonSchemaDefaultTypes.includes(subSchema.type.toLowerCase());
    }

    private isInvalidType(subSchema: JsonSchema) {
        return subSchema.type
               && !jsonSchemaDefaultTypes.includes(subSchema.type)
               && !this.customTypes.includes(subSchema.type);
    }
}
