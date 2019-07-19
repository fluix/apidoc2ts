import {IApiDocEndpoint} from "./ApiDocInterfaces";
import {ApiDocField} from "./ApiDocField";
import {JsonSchema} from "./JsonSchema";
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

    private convertFieldsToProperties(fieldGroups): Record<string, JsonSchema> {
        const fields = _.flatMap(fieldGroups).map(field => new ApiDocField(field));

        const properties = {};
        fields.forEach(field => {
            const jsonSchemaProperty = ApiDocEndpointParser.toJsonSchemaProperty(field);

            if (!field.nested) {
                properties[field.fieldName] = jsonSchemaProperty;
                return;
            }

            const property = this.getNestedProperty(properties, field.qualifiedName);
            if (!property.properties) {
                property.properties = {};
            }
            property.properties[field.fieldName] = jsonSchemaProperty;
        });

        return properties;
    }

    private getNestedProperty(properties: {}, qualifiedName: Array<string>): JsonSchema {
        return qualifiedName.slice(1).reduce((property: JsonSchema, name: string) => {
            if (property.properties && property.properties[name]) {
                return property.properties[name];
            }

            property.type = "object";
            property.properties = {};
            property.properties[name] = {};
            return property.properties[name];
        }, properties[qualifiedName[0]]);
    }

    static toJsonSchemaProperty(field: ApiDocField): JsonSchema {
        return {
            type: field.type,
            required: field.required,
            enum: field.enum.length ? field.enum : undefined,
        };
    }
}
