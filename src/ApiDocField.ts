import {IApiDocField} from "./ApiDocInterfaces";

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
        return this._type;
    }

    get fieldName() {
        return this._qualifiedName[this._qualifiedName.length - 1];
    }

    get qualifiedName() {
        return this._qualifiedName;
    }

    get nested() {
        return this._qualifiedName.length !== 1;
    }

    constructor(field: IApiDocField) {
        this._type = field.type;
        this._fieldName = field.field;
        this._qualifiedName = this._fieldName.split(".");
        this.optional = Boolean(field.optional);
        this.allowedValues = field.allowedValues || [];
    }
}
