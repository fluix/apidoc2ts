import {IApiDocField} from "./ApiDocInterfaces";
import {JsonSchema, JsonSchemaDefaultValues} from "./JsonSchema";

export class ApiDocField {
    private readonly optional: boolean;
    private readonly _type: string;
    private readonly allowedValues: Array<string>;
    private readonly field: string;

    get required() {
        return !this.optional;
    }

    get custom() {
        return !JsonSchemaDefaultValues.includes(this._type);
    }

    get enum() {
        return this.allowedValues;
    }

    get type() {
        return this._type;
    }

    constructor(field: IApiDocField) {
        this._type = field.type;
        this.field = field.field;
        this.optional = Boolean(field.optional);
        this.allowedValues = field.allowedValues || [];
    }

    toJsonSchemaField(): JsonSchema {
        return {
            type: this._type,
            required: this.required,
            enum: this.allowedValues,
        };
    }
}
