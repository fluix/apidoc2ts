import {IApiDocEndpoint} from "./ApiDocInterfaces";
import {ApiDocField} from "./ApiDocField";
import {JsonSchema} from "./JsonSchema";
import * as _ from "lodash";

const quicktypeFakeObject = {
    type: "object",
    properties: {
        prop: {},
    },
};

export class ApiDocEndpoint {
    private readonly fields: Array<ApiDocField>;
    public readonly customTypes: Array<string>;

    constructor(endpoint: IApiDocEndpoint) {
        if (!endpoint.parameter) {
            throw new Error("No parameters specified");
        }

        this.fields = this.extractFields(endpoint.parameter.fields);
        this.customTypes = this.getCustomTypes();
    }

    toJsonSchema(): JsonSchema {
        const schema = {
            type: "object",
            definitions: {},
            properties: {},
        };

        this.customTypes.forEach(type => {
            schema.definitions[type] = quicktypeFakeObject;
        });

        this.fields.forEach(field => {
            schema.properties[field.fieldName] = field.custom
                ? ApiDocEndpoint.toJsonSchemaRef(field)
                : ApiDocEndpoint.toJsonSchemaField(field);
        });

        return schema;
    }

    private extractFields(fieldGroups): Array<ApiDocField> {
        return _.flatMap(fieldGroups).map(field => new ApiDocField(field));
    }

    private getCustomTypes(): Array<string> {
        return this.fields
            .filter(field => field.custom)
            .map(field => field.type);
    }

    static toJsonSchemaRef(field: ApiDocField): JsonSchema {
        return {
            $ref: `#/definitions/${field.type}`,
        };
    }

    static toJsonSchemaField(field: ApiDocField): JsonSchema {
        return {
            type: field.type,
            required: field.required,
            enum: field.enum.length ? field.enum : undefined,
        };
    }
}
