import { last } from "lodash";
import { IApiDocField } from "../ApiDocInterfaces";

export class ApiDocField {
    private readonly optional: boolean;
    private readonly _type: string;
    private readonly allowedValues: Array<string>;
    private readonly _fieldName: string;
    private readonly _qualifiedName: Array<string>;

    get required(): boolean {
        return !this.optional;
    }

    get enum(): Array<string> {
        return this.allowedValues;
    }

    get type(): string {
        return this._type.replace("[]", "");
    }

    get fieldName(): string {
        return last(this._qualifiedName) || this._fieldName;
    }

    get qualifiedName(): Array<string> {
        return this._qualifiedName;
    }

    get nested(): boolean {
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
