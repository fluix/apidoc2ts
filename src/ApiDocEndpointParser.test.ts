import {ApiDocEndpointParser} from "./ApiDocEndpointParser";
import {ApiDocField} from "./ApiDocField";
import {JsonSchema} from "./JsonSchema";

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

describe("apiDoc Endpoint", () => {

    let parser: ApiDocEndpointParser;

    beforeEach(() => {
        parser = new ApiDocEndpointParser();
    });

    it("should throw exception if no parameters are specified", () => {
        expect(() => {
            return new ApiDocEndpointParser().parseEndpoint({});
        }).toThrow();
    });

    it("should create property with custom type", () => {
        const endpointData = {
            parameter: {
                fields: {Parameter: [customTypeField]},
            },
        };

        expect(parser.parseEndpoint(endpointData).properties!.fieldName2.type).toBe("CustomType1");
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
                    Parameter: [
                        {
                            type: "object",
                            field: "user",
                        },
                        {
                            type: "string",
                            field: "user.name",
                        },
                    ],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields);
        expect(schema.properties!.user.properties!.name).toBeDefined();
    });

    it("should write double nested field info to property tree", () => {
        const endpointWithNestedFields = {
            parameter: {
                fields: {
                    Parameter: [
                        {
                            type: "object",
                            field: "user",
                        },
                        {
                            type: "object",
                            field: "user.name",
                        },
                        {
                            type: "number",
                            field: "user.name.age",
                        },
                    ],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields);
        expect(schema.properties!.user.properties!.name.properties!.age).toBeDefined();
    });

    it("should create skipped root properties for nested properties", () => {
        const endpointWithSkippedNestedFields = {
            parameter: {
                fields: {
                    Parameter: [
                        {
                            type: "object",
                            field: "user",
                        },
                        {
                            type: "string",
                            field: "user.name.first",
                        },
                    ],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithSkippedNestedFields);
        expect(schema.properties!.user.properties!.name).toBeDefined();
        expect(schema.properties!.user.properties!.name.properties!.first).toBeDefined();
    });

    it("should create skipped root properties for nested properties", () => {
        const endpointWithSkippedNestedFields = {
            parameter: {
                fields: {
                    Parameter: [
                        {
                            type: "string",
                            field: "user.name.first",
                        },
                        {
                            type: "object",
                            field: "user",
                        },
                    ],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithSkippedNestedFields);
        expect(schema.properties!.user.properties!.name).toBeDefined();
        expect(schema.properties!.user.properties!.name.properties!.first).toBeDefined();
    });

    it("should create array properties for array fields", () => {
        const apiDocField = new ApiDocField(arrayField);
        expect(ApiDocEndpointParser.toJsonSchemaProperty(apiDocField).type).toBe("array");
    });

    it("should create array property with the same items type as field", () => {
        const apiDocField = new ApiDocField(arrayField);
        const items = ApiDocEndpointParser.toJsonSchemaProperty(apiDocField).items;
        expect(Array.isArray(items)).toBeFalsy();
        expect((items as JsonSchema).type).toBe("string");
    });

    it("should create array property with the same required status as field", () => {
        const apiDocField = new ApiDocField(arrayField);
        expect(ApiDocEndpointParser.toJsonSchemaProperty(apiDocField).required).toBeTruthy();
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

        expect(parser.parseEndpoint(endpointData)).toEqual(expectedSchema);
    });
});
