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
            properties[field.fieldName] = ApiDocEndpointParser.toJsonSchemaField(field);
        });

        return properties;
    }

    static toJsonSchemaField(field: ApiDocField): JsonSchema {
        return {
            type: field.type,
            required: field.required,
            enum: field.enum.length ? field.enum : undefined,
        };
    }
}
