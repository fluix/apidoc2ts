import ApiDocField from "./ApiDocField";

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

    it("should return array of tokens of fully qualified name", () => {
        const nestedField = new ApiDocField({
            type: "number",
            field: "nested.field.name",
        });

        expect(nestedField.qualifiedName).toEqual(["nested", "field", "name"]);
    });

    it("should return field name without qualified part", () => {
        const nestedField = new ApiDocField({
            type: "number",
            field: "nested.field.name",
        });

        expect(nestedField.fieldName).toBe("name");
    });

    it("should consider field nested if it's name is qualified", () => {
        const nestedField = new ApiDocField({
            type: "number",
            field: "nested.field.name",
        });

        expect(nestedField.nested).toBeTruthy();
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

    it("should show if field is array", () => {
        const arrayField = new ApiDocField({
            type: "string[]",
            field: "fieldName",
        });

        expect(arrayField.isArray).toBeTruthy();
    });

    it("should show that field is array if it's type is literally 'array'", () => {
        const arrayField = new ApiDocField({
            type: "array",
            field: "fieldName",
        });

        expect(arrayField.isArray).toBeTruthy();
    });

    it("should return field type without array notation", () => {
        const arrayField = new ApiDocField({
            type: "string[]",
            field: "fieldName",
        });

        expect(arrayField.type).toBe("string");
    });

    it("should consider missing type as string", () => {
        const missingTypeField = new ApiDocField({
            field: "fieldName",
        });

        expect(missingTypeField.type).toBe("string");
    });
});
