import {IApiDocEndpoint} from "./ApiDocInterfaces";
import {ApiDocField} from "./ApiDocField";
import {JsonSchema} from "./JsonSchema";
import * as _ from "lodash";

export class ApiDocEndpoint {
    private readonly fields: Array<ApiDocField>;

    constructor(endpoint: IApiDocEndpoint) {
        if (!endpoint.parameter) {
            throw new Error("No parameters specified");
        }

        this.fields = this.extractFields(endpoint.parameter.fields);
    }

    toJsonSchema(): JsonSchema {
        const schema = {
            type: "object",
            properties: {},
        };

        this.fields.forEach(field => {
            schema.properties[field.fieldName] = ApiDocEndpoint.toJsonSchemaField(field);
        });

        return schema;
    }

    private extractFields(fieldGroups): Array<ApiDocField> {
        return _.flatMap(fieldGroups).map(field => new ApiDocField(field));
    }

    static toJsonSchemaField(field: ApiDocField): JsonSchema {
        return {
            type: field.type,
            required: field.required,
            enum: field.enum.length ? field.enum : undefined,
        };
    }
}
