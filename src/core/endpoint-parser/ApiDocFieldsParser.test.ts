import {JsonSchema} from "../JsonSchema";
import {ApiDocField} from "./ApiDocField";
import {ApiDocFieldsParser} from "./ApiDocFieldsParser";

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

const arrayField = {
    group: "groupName",
    type: "string[]",
    optional: false,
    field: "fieldName",
};

const arrayFieldWithAllowedValues = {
    group: "groupName",
    type: "string[]",
    field: "fieldName",
    allowedValues: ["value1", "value2"],
};

const literallyArrayField = {
    group: "groupName",
    type: "array",
    field: "fieldName",
};

const parentField = {
    type: "object",
    field: "user",
};

const parentUppercaseArrayField = {
    type: "Array",
    field: "user",
};

const parentObjectArrayField = {
    type: "object[]",
    field: "user",
};

const nestedField = {
    type: "string",
    field: "user.name",
};

const doubleNestedField = {
    type: "number",
    field: "user.name.first",
};

const defaultEndpointMetadata = {
    type: "",
    url: "",
    name: "",
    group: "",
    filename: "",
    version: "",
};

describe("apiDoc Endpoint", () => {
    const parser = new ApiDocFieldsParser();

    it("should return empty schemas if endpoint has no parameters at all", () => {
        expect(parser.parseEndpoint(defaultEndpointMetadata)).toEqual({
            request: {},
            response: {},
            error: {},
        });
    });

    it("should return empty schemas if endpoint has examples only", () => {
        expect(parser.parseEndpoint({
            ...defaultEndpointMetadata,
            parameter: {examples: []},
            success: {examples: []},
            error: {examples: []},
        })).toEqual({
            request: {},
            response: {},
            error: {},
        });
    });

    it("should return separate schemas for request/response/error", () => {
        const endpointData = {
            parameter: {
                fields: {Parameter: [requiredField]},
            },
            ...defaultEndpointMetadata,
        };

        const parserResult = parser.parseEndpoint(endpointData);
        expect(parserResult.request).toBeDefined();
        expect(parserResult.response).toBeDefined();
        expect(parserResult.error).toBeDefined();
    });

    it("should parse request, response and error", () => {
        const endpointData = {
            parameter: {
                fields: {Parameter: [parentField]},
            },
            success: {
                fields: {"Success 2xx": [requiredField]},
            },
            error: {
                fields: {"Error 4xx": [customTypeField]},
            },
            ...defaultEndpointMetadata,
        };

        const parserResult = parser.parseEndpoint(endpointData);
        expect(parserResult.request).toHaveProperty("properties.user");
        expect(parserResult.response).toHaveProperty("properties.fieldName1");
        expect(parserResult.error).toHaveProperty("properties.fieldName2");
    });

    it("should create property with custom type", () => {
        const endpointData = {
            parameter: {
                fields: {Parameter: [customTypeField]},
            },
            ...defaultEndpointMetadata,
        };

        expect(parser.parseEndpoint(endpointData).request.properties!.fieldName2.type)
            .toBe(customTypeField.type);
    });

    it("should not declare 'enum' in schema if no allowedValues are specified", () => {
        const noEnumField = new ApiDocField({
            type: "string",
            field: "fieldName",
        });
        expect(ApiDocFieldsParser.toJsonSchemaProperty(noEnumField).enum).toBeUndefined();
    });

    it("should write nested field info to root property", () => {
        const endpointWithNestedFields = {
            parameter: {
                fields: {
                    Parameter: [parentField, nestedField],
                },
            },
            ...defaultEndpointMetadata,
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields).request;
        expect(schema).toHaveProperty("properties.user.properties.name");
    });

    it("should write double nested field info to property tree", () => {
        const endpointWithNestedFields = {
            parameter: {
                fields: {
                    Parameter: [parentField, nestedField, doubleNestedField],
                },
            },
            ...defaultEndpointMetadata,
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields).request;
        expect(schema).toHaveProperty("properties.user.properties.name.properties.first");
    });

    it("should create skipped root properties for nested properties", () => {
        const endpointWithSkippedNestedFields = {
            parameter: {
                fields: {
                    Parameter: [parentField, doubleNestedField],
                },
            },
            ...defaultEndpointMetadata,
        };

        const schema = parser.parseEndpoint(endpointWithSkippedNestedFields).request;
        expect(schema).toHaveProperty("properties.user.properties.name.properties.first");
    });

    it("should create skipped root properties for unsorted nested properties", () => {
        const endpointWithSkippedNestedFields = {
            parameter: {
                fields: {
                    Parameter: [doubleNestedField, parentField],
                },
            },
            ...defaultEndpointMetadata,
        };

        const schema = parser.parseEndpoint(endpointWithSkippedNestedFields).request;
        expect(schema).toHaveProperty("properties.user.properties.name.properties.first");
    });

    it("should create array properties for array fields", () => {
        const apiDocField = new ApiDocField(arrayField);
        expect(ApiDocFieldsParser.toJsonSchemaProperty(apiDocField).type).toBe("array");
    });

    it("should create enum property in 'items' if allowed values are specified", () => {
        const apiDocField = new ApiDocField(arrayFieldWithAllowedValues);
        const jsonSchemaProperty = (ApiDocFieldsParser.toJsonSchemaProperty(apiDocField).items) as JsonSchema;
        expect(jsonSchemaProperty.enum).toEqual(arrayFieldWithAllowedValues.allowedValues);
    });

    it("should not specify array items type if array is untyped", () => {
        const apiDocField = new ApiDocField(literallyArrayField);
        const jsonSchemaProperty = (ApiDocFieldsParser.toJsonSchemaProperty(apiDocField).items) as JsonSchema;
        expect(jsonSchemaProperty.type).toBeUndefined();
    });

    it("should create array property with the same items type as field", () => {
        const apiDocField = new ApiDocField(arrayField);
        const {items} = ApiDocFieldsParser.toJsonSchemaProperty(apiDocField);
        expect(Array.isArray(items)).toBeFalsy();
        expect((items as JsonSchema).type).toBe("string");
    });

    it("should create array property with the same required status as field", () => {
        const apiDocField = new ApiDocField(arrayField);
        expect(ApiDocFieldsParser.toJsonSchemaProperty(apiDocField).required).toBeTruthy();
    });

    it("should write nested fields of array field to 'items.properties'", () => {
        const endpointWithNestedFields = {
            parameter: {
                fields: {
                    Parameter: [parentObjectArrayField, nestedField],
                },
            },
            ...defaultEndpointMetadata,
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields).request;
        expect(schema).toHaveProperty("properties.user.items.properties.name");
    });

    it("should write nested fields of field with type 'array' to 'items.properties'", () => {
        const endpointWithNestedFields = {
            parameter: {
                fields: {
                    Parameter: [parentUppercaseArrayField, nestedField],
                },
            },
            ...defaultEndpointMetadata,
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields).request;
        expect(schema).toHaveProperty("properties.user.items.properties.name");
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

        expect(ApiDocFieldsParser.toJsonSchemaProperty(apiDocField)).toEqual(jsonSchemaField);
    });

    it("should generate interface JSON Schema", () => {
        const endpointData = {
            parameter: {
                fields: {Parameter: [requiredField, customTypeField, enumField]},
            },
            ...defaultEndpointMetadata,
        };

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

        expect(parser.parseEndpoint(endpointData).request).toEqual(expectedSchema);
    });
});
