import {ApiDocEndpointParser} from "./ApiDocEndpointParser";
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

const parentField = {
    type: "object",
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

describe("apiDoc Endpoint", () => {

    const parser = new ApiDocEndpointParser();

    it("should throw exception if endpoint is empty", () => {
        expect(() => {
            return new ApiDocEndpointParser().parseEndpoint({});
        }).toThrow();
    });

    it("should return separate schemas for request/response/error", () => {
        const endpointData = {
            parameter: {
                fields: {Parameter: [requiredField]},
            },
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
                fields: {["Success 2xx"]: [requiredField]},
            },
            error: {
                fields: {["Error 4xx"]: [customTypeField]},
            },
        };

        const parserResult = parser.parseEndpoint(endpointData);
        expect(parserResult.request).toHaveProperty(["properties", "user"]);
        expect(parserResult.response).toHaveProperty(["properties", "fieldName1"]);
        expect(parserResult.error).toHaveProperty(["properties", "fieldName2"]);
    });

    it("should create property with custom type", () => {
        const endpointData = {
            parameter: {
                fields: {Parameter: [customTypeField]},
            },
        };

        expect(parser.parseEndpoint(endpointData).request.properties!.fieldName2.type).toBe("CustomType1");
    });

    it("should not declare 'enum' in schema if no allowedValues are specified", () => {
        const noEnumField = new ApiDocField({
            type: "string",
            field: "fieldName",
        });
        expect(ApiDocEndpointParser.toJsonSchemaProperty(noEnumField).enum).toBeUndefined();
    });

    it("should write nested field info to root property", () => {
        const endpointWithNestedFields = {
            parameter: {
                fields: {
                    Parameter: [parentField, nestedField],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields).request;
        expect(schema.properties!.user.properties!.name).toBeDefined();
    });

    it("should write double nested field info to property tree", () => {
        const endpointWithNestedFields = {
            parameter: {
                fields: {
                    Parameter: [parentField, nestedField, doubleNestedField],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields).request;
        expect(schema.properties!.user.properties!.name.properties!.first).toBeDefined();
    });

    it("should create skipped root properties for nested properties", () => {
        const endpointWithSkippedNestedFields = {
            parameter: {
                fields: {
                    Parameter: [parentField, doubleNestedField],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithSkippedNestedFields).request;
        expect(schema.properties!.user.properties!.name).toBeDefined();
        expect(schema.properties!.user.properties!.name.properties!.first).toBeDefined();
    });

    it("should create skipped root properties for nested properties", () => {
        const endpointWithSkippedNestedFields = {
            parameter: {
                fields: {
                    Parameter: [doubleNestedField, parentField],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithSkippedNestedFields).request;
        expect(schema.properties!.user.properties!.name).toBeDefined();
        expect(schema.properties!.user.properties!.name.properties!.first).toBeDefined();
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

        expect(ApiDocEndpointParser.toJsonSchemaProperty(apiDocField)).toEqual(jsonSchemaField);
    });

    it("should generate interface JSON Schema", () => {
        const endpointData = {
            parameter: {
                fields: {Parameter: [requiredField, customTypeField, enumField]},
            },
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
