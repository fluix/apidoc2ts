import * as _ from "lodash";
import {IApiDocField} from "../ApiDocInterfaces";

export class ApiDocField {
    private readonly optional: boolean;
    private readonly _type: string;
    private readonly allowedValues: Array<string>;
    private readonly _fieldName: string;
    private readonly _qualifiedName: Array<string>;

    get required() {
        return !this.optional;
    }

    get enum() {
        return this.allowedValues;
    }

    get type() {
        return this._type.replace("[]", "");
    }

    get fieldName() {
        return _.last(this._qualifiedName);
    }

    get qualifiedName() {
        return this._qualifiedName;
    }

    get nested() {
        return this._qualifiedName.length !== 1;
    }

    get isArray(): boolean {
        return this._type.endsWith("[]") || this._type.toLowerCase() === "array";
    }

    constructor(field: IApiDocField) {
        this._type = field.type ? field.type : "string";
        this._fieldName = field.field;
        this._qualifiedName = this._fieldName.split(".");
        this.optional = Boolean(field.optional);
        this.allowedValues = field.allowedValues || [];
    }
}
