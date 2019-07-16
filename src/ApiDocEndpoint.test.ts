import {ApiDocEndpoint} from "./ApiDocEndpoint";

const requiredField = {
    type: "string",
    field: "fieldName1",
    optional: false,
};

const customTypeField = {
    type: "CustomType1",
    field: "fieldName2",
};

const anotherCustomTypeField = {
    type: "CustomType2",
    field: "fieldName3",
};

const enumField = {
    type: "number",
    field: "fieldName4",
    allowedValues: [1, 2, 3],
};

describe("apiDoc Endpoint", () => {

    it("should throw exception if no parameters are specified", () => {
        expect(() => {
            const invalidEndpoint = new ApiDocEndpoint({});
        }).toThrow();
    });

    it("should reference custom types", () => {
        const endpointWithCustomType = new ApiDocEndpoint({
            parameter: {
                fields: {Parameter: [customTypeField]},
            },
        });

        const schema = endpointWithCustomType.toJsonSchema();
        expect(schema.properties).toBeDefined();
        expect(schema.properties!.fieldName2.$ref).toBe("#/definitions/CustomType1");
    });

    it("should create fake definition for custom type", () => {
        const endpointWithCustomType = new ApiDocEndpoint({
            parameter: {
                fields: {Parameter: [customTypeField]},
            },
        });

        const schema = endpointWithCustomType.toJsonSchema();
        expect(schema.definitions).toBeDefined();
        expect(schema.definitions!.hasOwnProperty("CustomType1")).toBeTruthy();
    });

    it("should get all custom types from fields", () => {
        const endpointWithMultipleCustomTypes = {
            parameter: {
                fields: {Parameter: [requiredField, customTypeField, anotherCustomTypeField]},
            },
        };

        const endpoint = new ApiDocEndpoint(endpointWithMultipleCustomTypes);
        expect(endpoint.customTypes).toEqual(["CustomType1", "CustomType2"]);
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
                    $ref: "#/definitions/CustomType1",
                },
                fieldName4: {
                    type: "number",
                    required: true,
                    enum: [1, 2, 3],
                },
            },
            definitions: {
                CustomType1: {
                    type: "object",
                    properties: {
                        prop: {},
                    },
                },
            },
        };

        expect(endpoint.toJsonSchema()).toEqual(expectedSchema);
    });
});
