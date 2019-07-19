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

    it("should set nested properties fields to root property", () => {
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
                        {
                            type: "string",
                            field: "user.name.firstName",
                        },
                    ],
                },
            },
        };

        const schema = parser.parseEndpoint(endpointWithNestedFields);
        expect(schema.properties!.user.properties!.name).toBeDefined();
        expect(schema.properties!.user.properties!.name.properties!.firstName).toBeDefined();
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
