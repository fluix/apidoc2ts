import {JsonSchema, jsonSchemaDefaultTypes} from "./JsonSchema";
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

    async createInterface(schema: JsonSchema, name = "Generated"): Promise<string> {
        if (_.isEmpty(schema)) {
            return "";
        }

        if (this.customTypes.includes(name)) {
            throw new Error(`Interface ${name} exists in custom types: [${this.customTypes.join(",")}]`);
        }

        const schemaCopy = _.cloneDeep(schema);
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
        this.lowercaseDefaultTypes(schema);
        this.replaceInvalidTypesWithStrings(schema);

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
        const fakeDefinitions = {};
        this.customTypes.forEach(type => {
            fakeDefinitions[type] = qtFakeCustomType;
        });
        schema.definitions = Object.assign({}, schema.definitions, fakeDefinitions);
    }

    private replaceCustomTypesWithReferences(schema: JsonSchema) {
        const customProperties = {};
        _.entries(schema.properties).forEach(([propertyKey, property]: [string, JsonSchema]) => {
            if (!property.type) {
                return;
            }

            if (this.customTypes.includes(property.type)) {
                customProperties[propertyKey] = {$ref: `#/definitions/${property.type}`};
            }
        });

        schema.properties = Object.assign({}, schema.properties, customProperties);
    }

    private includeRequiredPropertiesList(schema: JsonSchema) {
        const requiredProperties: Array<string> = [];
        _.entries(schema.properties).forEach(([propertyKey, property]: [string, JsonSchema]) => {
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
        this.traverseSchemaRecursively(schema, (subSchema) => {
            if (!subSchema.type || !this.isDefaultType(subSchema)) {
                return;
            }

            subSchema.type = subSchema.type.toLowerCase();
        });
    }

    private replaceInvalidTypesWithStrings(schema: JsonSchema) {
        this.traverseSchemaRecursively(schema, (subSchema) => {
            if (!this.isInvalidType(subSchema)) {
                return;
            }

            subSchema.description = `Replaced type: ${subSchema.type}`;
            subSchema.type = "string";
        });
    }

    private isDefaultType(subSchema) {
        return subSchema.type
               && !this.customTypes.includes(subSchema.type)
               && jsonSchemaDefaultTypes.includes(subSchema.type.toLowerCase());
    }

    private isInvalidType(subSchema) {
        return subSchema.type &&
               !jsonSchemaDefaultTypes.includes(subSchema.type) &&
               !this.customTypes.includes(subSchema.type);
    }

    private traverseSchemaRecursively(schema: JsonSchema, callback: (schema: JsonSchema) => void) {
        _.values(schema.properties).forEach((property: JsonSchema) => {
            callback(property);
            this.traverseSchemaRecursively(property, callback);
        });

        _.values(schema.definitions).forEach((definition: JsonSchema) => {
            callback(definition);
            this.traverseSchemaRecursively(definition, callback);
        });
    }
}
