import {ApiDocField} from "./ApiDocField";

describe("apiDoc Field", () => {
    it("should return required status", () => {
        const optionalField = new ApiDocField({
            type: "string",
            field: "fieldName",
            optional: true,
        });
        expect(optionalField.required).toBeFalsy();
    });

    it("should consider field required if 'optional' is missing", () => {
        const requiredField = new ApiDocField({
            type: "number",
            field: "fieldName",
        });
        expect(requiredField.required).toBeTruthy();
    });

    it("should show if the type is custom", () => {
        const customTypeField = new ApiDocField({
            type: "CustomType",
            field: "fieldName",
        });
        expect(customTypeField.custom).toBeTruthy();
    });

    it("should generate enum from allowedValues", () => {
        const enumField = new ApiDocField({
            type: "string",
            field: "fieldName",
            allowedValues: ["val1", "val2"],
        });
        expect(enumField.enum).toEqual(["val1", "val2"]);
    });

    it("should return empty array for enum if no allowedValues are specified", () => {
        const noEnumField = new ApiDocField({
            type: "string",
            field: "fieldName",
        });
        expect(noEnumField.enum).toEqual([]);
    });

    it("should not declare 'enum' in schema if no allowedValues are specified", () => {
        const noEnumField = new ApiDocField({
            type: "string",
            field: "fieldName",
        });
        expect(noEnumField.toJsonSchemaField().enum).toBeUndefined();
    });

    it("should generate JSON Schema for interface field", () => {
        const apiDocField = new ApiDocField({
            group: "groupName",
            type: "string",
            optional: false,
            field: "fieldName",
            allowedValues: ["value1", "value2"],
        });

        const jsonSchemaField = {
            type: "string",
            required: true,
            enum: ["value1", "value2"],
        };

        expect(apiDocField.toJsonSchemaField()).toEqual(jsonSchemaField);
    });
});
