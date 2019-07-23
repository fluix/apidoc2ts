import {IApiDocEndpoint} from "./ApiDocInterfaces";
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

    private convertFieldsToProperties(fieldGroups): JsonSubSchemas {
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

    private fillNestedField(properties, field, fieldJsonSchema): void {
        field.qualifiedName.reduce((parentProperties, currentNamePart, index, nameParts) => {
            const isLastNamePart = index === nameParts.length - 1;
            if (!isLastNamePart) {
                return this.createParentProperties(parentProperties, currentNamePart);
            }

            parentProperties[currentNamePart] = fieldJsonSchema;
            return parentProperties[currentNamePart];
        }, properties);
    }

    private createParentProperties(parentProperties, currentNamePart): JsonSubSchemas {
        parentProperties[currentNamePart] = parentProperties[currentNamePart] || {
            type: "object",
        };
        parentProperties[currentNamePart].properties = parentProperties[currentNamePart].properties || {};
        return parentProperties[currentNamePart].properties;
    }

    private getSortedFlatFields(fieldGroups): Array<ApiDocField> {
        return _.flatMap(fieldGroups).map(field => new ApiDocField(field))
                .sort((a, b) => a.qualifiedName.length - b.qualifiedName.length);
    }

    static toJsonSchemaProperty(field: ApiDocField): JsonSchema {
        return {
            type: field.type,
            required: field.required,
            enum: field.enum.length ? field.enum : undefined,
        };
    }
}
