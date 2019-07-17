import {IApiDocField} from "./ApiDocInterfaces";
import {JsonSchemaDefaultValues} from "./JsonSchema";

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

    get fieldName() {
        return this.field;
    }

    constructor(field: IApiDocField) {
        this._type = field.type;
        this.field = field.field;
        this.optional = Boolean(field.optional);
        this.allowedValues = field.allowedValues || [];
    }
}
