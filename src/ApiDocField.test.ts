import {ApiDocField} from "./ApiDocField";
import {IApiDocField} from "./ApiDocInterfaces";
import {JsonSchema} from "./JsonSchema";

describe("apiDoc Field", () => {
    it("should return required status", () => {
        const fieldData: IApiDocField = {
            type: "string",
            field: "fieldName",
            optional: true,
        };

        const field: ApiDocField = new ApiDocField(fieldData);
        expect(field.required).toBeFalsy();
    });

    it("should show if the type is custom", () => {
        const fieldData: IApiDocField = {
            type: "CustomType",
            field: "fieldName",
        };

        const field: ApiDocField = new ApiDocField(fieldData);
        expect(field.custom).toBeTruthy();
    });

    it("should generate enum from allowedValues", () => {
        const fieldData: IApiDocField = {
            type: "string",
            field: "fieldName",
            allowedValues: ["val1", "val2"],
        };

        const field: ApiDocField = new ApiDocField(fieldData);
        expect(field.enum).toEqual(["val1", "val2"]);
    });

    it("should generate JSON Schema", () => {
        const fieldData: IApiDocField = {
            group: "groupName",
            type: "string",
            optional: false,
            field: "fieldName",
            allowedValues: ["value1", "value2"],
        };

        const expected: JsonSchema = {
            type: "string",
            required: true,
            enum: ["value1", "value2"],
        };

        const field: ApiDocField = new ApiDocField(fieldData);
        expect(field.toJsonSchemaField()).toEqual(expected);
    });
});
