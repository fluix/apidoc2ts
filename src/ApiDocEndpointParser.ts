import {IApiDocEndpoint, IApiDocField} from "./ApiDocInterfaces";
import {ApiDocField} from "./ApiDocField";
import {JsonSchema, JsonSubSchemas} from "./JsonSchema";
import * as _ from "lodash";

export class ApiDocEndpointParser {
    parseEndpoint(endpoint: IApiDocEndpoint): JsonSchema {
        if (!endpoint.parameter) {
            throw new Error("No parameters specified");
        }

        const properties = this.convertFieldsToProperties(endpoint.parameter.fields);
        return {
            properties,
            type: "object",
        };
    }

    private convertFieldsToProperties(fieldGroups: Record<string, Array<IApiDocField>>): JsonSubSchemas {
        const fields = this.getSortedFlatFields(fieldGroups);

        const properties = {};
        fields.forEach(field => {
            const fieldJsonSchema = ApiDocEndpointParser.toJsonSchemaProperty(field);

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

            parentProperties[currentNamePart] = fieldJsonSchema;
            return parentProperties[currentNamePart];
        }, properties);
    }

    private createParentProperties(parentProperties: JsonSchema, currentNamePart: string): JsonSubSchemas {
        parentProperties[currentNamePart] = parentProperties[currentNamePart] || {
            type: "object",
        };
        parentProperties[currentNamePart].properties = parentProperties[currentNamePart].properties || {};
        return parentProperties[currentNamePart].properties;
    }

    private getSortedFlatFields(fieldGroups: Record<string, Array<IApiDocField>>): Array<ApiDocField> {
        return _.flatMap(fieldGroups).map(field => new ApiDocField(field))
                .sort((a, b) => a.qualifiedName.length - b.qualifiedName.length);
    }

    static toJsonSchemaProperty(field: ApiDocField): JsonSchema {
        if (field.isArray) {
            return {
                type: "array",
                required: field.required,
                items: {
                    type: field.type,
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
