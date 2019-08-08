import * as _ from "lodash";
import {IApiDocEndpoint, IApiDocEndpointPart, IApiDocEndpointPartWithFields, IApiDocField} from "../ApiDocInterfaces";
import {JsonSchema, JsonSubSchemas} from "../JsonSchema";
import {ApiDocField} from "./ApiDocField";

export interface ParserResult {
    request: JsonSchema;
    response: JsonSchema;
    error: JsonSchema;
}

export class ApiDocEndpointParser {
    parseEndpoint(endpoint: IApiDocEndpoint): ParserResult {
        if (this.isEmptyEndpoint(endpoint)) {
            throw new Error("Empty endpoint");
        }

        return {
            request: this.parseFields(endpoint.parameter),
            response: this.parseFields(endpoint.success),
            error: this.parseFields(endpoint.error),
        };
    }

    private isEmptyEndpoint(endpoint: IApiDocEndpoint) {
        return !this.isValidEndpointPart(endpoint.parameter)
               && !this.isValidEndpointPart(endpoint.success)
               && !this.isValidEndpointPart(endpoint.error);
    }

    private isValidEndpointPart(endpointPart?: IApiDocEndpointPart): endpointPart is IApiDocEndpointPartWithFields {
        return Boolean(endpointPart && endpointPart.fields);
    }

    private parseFields(endpointPart: IApiDocEndpointPart | undefined): JsonSchema {
        if (!this.isValidEndpointPart(endpointPart)) {
            return {};
        }

        return {
            type: "object",
            properties: this.convertFieldsToProperties(endpointPart.fields),
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
        if (
            parentProperties[currentNamePart]
            && parentProperties[currentNamePart].type.toLowerCase() === "array"
        ) {
            return this.createArrayProperties(parentProperties, currentNamePart);
        }

        return this.createObjectProperties(parentProperties, currentNamePart);
    }

    private createObjectProperties(parentProperties: JsonSchema, currentNamePart: string) {
        parentProperties[currentNamePart] = parentProperties[currentNamePart] || {
            type: "object",
        };
        parentProperties[currentNamePart].properties = parentProperties[currentNamePart].properties || {};
        return parentProperties[currentNamePart].properties;
    }

    private createArrayProperties(parentProperties: JsonSchema, currentNamePart: string) {
        parentProperties[currentNamePart].items =
            parentProperties[currentNamePart].items || {
                type: "object",
            };

        parentProperties[currentNamePart].items.properties =
            parentProperties[currentNamePart].items.properties || {};

        return parentProperties[currentNamePart].items.properties;
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
