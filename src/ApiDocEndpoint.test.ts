import {ApiDocEndpoint} from "./ApiDocEndpoint";
import {ApiDocField} from "./ApiDocField";

const requiredField = {
    type: "string",
    field: "fieldName1",
    optional: false,
};

const customTypeField = {
    type: "CustomType1",
    field: "fieldName2",
};

const enumField = {
    type: "number",
    field: "fieldName4",
    allowedValues: [1, 2, 3],
};

describe("apiDoc Endpoint", () => {

    it("should throw exception if no parameters are specified", () => {
        expect(() => {
            return new ApiDocEndpoint({});
        }).toThrow();
    });

    it("should create property with custom type", () => {
        const endpoint = new ApiDocEndpoint({
            parameter: {
                fields: {Parameter: [customTypeField]},
            },
        });

        expect(endpoint.toJsonSchema().properties!.fieldName2.type).toBe("CustomType1");
    });

    it("should not declare 'enum' in schema if no allowedValues are specified", () => {
        const noEnumField = new ApiDocField({
            type: "string",
            field: "fieldName",
        });
        expect(ApiDocEndpoint.toJsonSchemaField(noEnumField).enum).toBeUndefined();
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

        expect(ApiDocEndpoint.toJsonSchemaField(apiDocField)).toEqual(jsonSchemaField);
    });

    it("should generate interface JSON Schema", () => {
        const endpoint = new ApiDocEndpoint({
            parameter: {
                fields: {Parameter: [requiredField, customTypeField, enumField]},
            },
        });

        const expectedSchema = {
            type: "object",
            properties: {
                fieldName1: {
                    type: "string",
                    required: true,
                },
                fieldName2: {
                    type: "CustomType1",
                    required: true,
                },
                fieldName4: {
                    type: "number",
                    required: true,
                    enum: [1, 2, 3],
                },
            },
        };

        expect(endpoint.toJsonSchema()).toEqual(expectedSchema);
    });
});
