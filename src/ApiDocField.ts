import {IApiDocField} from "./ApiDocInterfaces";
import * as _ from "lodash";

export class ApiDocField {
    private readonly optional: boolean;
    private readonly _type: string;
    private readonly allowedValues: Array<string>;
    private readonly _fieldName: string;
    private readonly _qualifiedName: Array<string>;
    public readonly isArray: boolean;

    get required() {
        return !this.optional;
    }

    get enum() {
        return this.allowedValues;
    }

    get type() {
        return this._type;
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

    constructor(field: IApiDocField) {
        this._type = field.type ? field.type.replace("[]", "") : "string";
        this.isArray = field.type ? field.type.endsWith("[]") : false;
        this._fieldName = field.field;
        this._qualifiedName = this._fieldName.split(".");
        this.optional = Boolean(field.optional);
        this.allowedValues = field.allowedValues || [];
    }
}
