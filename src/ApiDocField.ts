import {IApiDocField} from "./ApiDocInterfaces";
import {JsonSchema, JsonSchemaDefaultValues} from "./JsonSchema";

export class ApiDocField {
    private readonly optional: boolean;
    private readonly type: string;
    private readonly allowedValues: Array<string>;
    private readonly field: string;

    get required() {
        return !this.optional;
    }

    get custom() {
        return !JsonSchemaDefaultValues.includes(this.type);
    }

    get enum() {
        return this.allowedValues;
    }

    constructor(field: IApiDocField) {
        this.type = field.type;
        this.field = field.field;
        this.optional = !!field.optional;
        this.allowedValues = field.allowedValues || [];
    }

    toJsonSchemaField(): JsonSchema {
        return {
            type: this.type,
            required: this.required,
            enum: this.allowedValues,
        };
    }
}
