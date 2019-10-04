import {flatMap} from "lodash";
import {
    endpointHasFields,
    IApiDocEndpoint,
    IApiDocEndpointPart,
    IApiDocField,
    isEndpointPartWithFields,
} from "../ApiDocInterfaces";
import {JsonSchema, JsonSubSchemas} from "../JsonSchema";
import ApiDocField from "./ApiDocField";

export interface ParserResult {
    request: JsonSchema;
    response: JsonSchema;
    error: JsonSchema;
}

// TODO: refactor methods to not have side effects

export default class ApiDocFieldsParser {
    parseEndpoint(endpoint: IApiDocEndpoint): ParserResult {
        if (!endpointHasFields(endpoint)) {
            return {
                request: {},
                response: {},
                error: {},
            };
        }

        return {
            request: this.parseFields(endpoint.parameter),
            response: this.parseFields(endpoint.success),
            error: this.parseFields(endpoint.error),
        };
    }

    private parseFields(endpointPart: IApiDocEndpointPart | undefined): JsonSchema {
        if (!isEndpointPartWithFields(endpointPart)) {
            return {};
        }

        return {
            type: "object",
            properties: this.convertFieldsToProperties(endpointPart.fields),
        };
    }

    private convertFieldsToProperties(fieldGroups: Record<string, Array<IApiDocField>>): JsonSubSchemas {
        const fields = this.getSortedFlatFields(fieldGroups);

        const properties: JsonSchema = {};
        // eslint-disable-next-line consistent-return
        fields.forEach(field => {
            const fieldJsonSchema = ApiDocFieldsParser.toJsonSchemaProperty(field);

            if (field.nested) {
                return this.fillNestedField(properties, field, fieldJsonSchema);
            }

            properties[field.fieldName] = fieldJsonSchema;
        });

        return properties;
    }

    private fillNestedField(properties: JsonSchema, field: ApiDocField, fieldJsonSchema: JsonSchema): void {
        field.qualifiedName.reduce((parentProperties, currentNamePart, index, nameParts) => {
            const isLastNamePart = index === nameParts.length - 1;
            if (!isLastNamePart) {
                return this.createParentProperties(parentProperties, currentNamePart);
            }

            // eslint-disable-next-line no-param-reassign
            parentProperties[currentNamePart] = fieldJsonSchema;
            return parentProperties[currentNamePart];
        }, properties);
    }

    private createParentProperties(parentProperties: JsonSchema, currentNamePart: string): JsonSubSchemas {
        if (
            parentProperties[currentNamePart]
            && parentProperties[currentNamePart].type.toLowerCase() === "array"
        ) {
            return this.createArrayProperties(parentProperties, currentNamePart);
        }

        return this.createObjectProperties(parentProperties, currentNamePart);
    }

    private createObjectProperties(parentProperties: JsonSchema, currentNamePart: string) {
        // eslint-disable-next-line no-param-reassign
        parentProperties[currentNamePart] = parentProperties[currentNamePart] || {
            type: "object",
        };
        // eslint-disable-next-line no-param-reassign
        parentProperties[currentNamePart].properties = parentProperties[currentNamePart].properties || {};
        return parentProperties[currentNamePart].properties;
    }

    private createArrayProperties(parentProperties: JsonSchema, currentNamePart: string) {
        // eslint-disable-next-line no-param-reassign
        parentProperties[currentNamePart].items = parentProperties[currentNamePart].items || {
            type: "object",
        };

        // eslint-disable-next-line no-param-reassign
        parentProperties[currentNamePart].items.properties = parentProperties[currentNamePart].items.properties || {};

        return parentProperties[currentNamePart].items.properties;
    }

    private getSortedFlatFields(fieldGroups: Record<string, Array<IApiDocField>>): Array<ApiDocField> {
        return flatMap(fieldGroups)
            .map((field: IApiDocField) => new ApiDocField(field))
            .sort((a: ApiDocField, b: ApiDocField) => a.qualifiedName.length - b.qualifiedName.length);
    }

    static toJsonSchemaProperty(field: ApiDocField): JsonSchema {
        if (field.isArray) {
            return {
                type: "array",
                required: field.required,
                items: {
                    type: field.type.toLowerCase() === "array" ? undefined : field.type,
                    enum: field.enum.length ? field.enum : undefined,
                },
            };
        }

        return {
            type: field.type,
            required: field.required,
            enum: field.enum.length ? field.enum : undefined,
        };
    }
}
