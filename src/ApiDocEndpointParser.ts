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
            const props = this.lookupProperties(properties, field.qualifiedName);
            props[field.fieldName] = ApiDocEndpointParser.toJsonSchemaProperty(field);
        });

        return properties;
    }

    private lookupProperties(properties: {}, qualifiedName: Array<string>): {} {
        if (qualifiedName.length === 1) {
            return properties;
        }

        let nestedProperties = properties;
        qualifiedName.forEach((propertyName) => {
            if (nestedProperties[propertyName] && nestedProperties[propertyName].properties) {
                nestedProperties = nestedProperties[propertyName].properties;
                return;
            }

            nestedProperties = this.createNestedProperties(nestedProperties, propertyName);
        });

        return nestedProperties;
    }

    private createNestedProperties(nestedProperties, propertyName) {
        nestedProperties[propertyName] = {};
        nestedProperties[propertyName].properties = {
            type: "object",
            properties: {},
        };
        return nestedProperties[propertyName].properties;
    }

    static toJsonSchemaProperty(field: ApiDocField): JsonSchema {
        return {
            type: field.type,
            required: field.required,
            enum: field.enum.length ? field.enum : undefined,
        };
    }
}
