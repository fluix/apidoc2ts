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
});
