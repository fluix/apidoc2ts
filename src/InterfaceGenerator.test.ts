import {InterfaceGenerator} from "./InterfaceGenerator";

const simpleSchema = {
    type: "object",
    properties: {
        param: {
            type: "number",
        },
    },
};

const schemaWithOptionalAndRequiredParams = {
    type: "object",
    properties: {
        optionalParam: {
            type: "number",
        },
        requiredParam: {
            type: "number",
            required: true,
        },
    },
};

const schemaWithCustomType = {
    type: "object",
    properties: {
        param: {
            type: "User",
        },
    },
};

const schemaWithTwoRequiredCustomTypes = {
    type: "object",
    properties: {
        param: {
            type: "User",
            required: true,
        },
        param2: {
            type: "User",
            required: true,
        },
    },
};

const schemaWithEnum = {
    type: "object",
    properties: {
        param: {
            type: "string",
            enum: ["a", "b", "c"],
        },
    },
};

const schemaWithTwoCustomTypes = {
    type: "object",
    properties: {
        param: {
            type: "User",
        },
        param2: {
            $ref: "#/definitions/Admin",
        },
    },
    definitions: {
        Admin: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                },
            },
        },
    },
};

const schemaWithUppercaseDefaultTypes = {
    type: "object",
    properties: {
        param1: {
            type: "String",
        },
        param2: {
            type: "Number",
        },
        param3: {
            type: "object",
            properties: {
                nestedParam1: {
                    type: "Boolean",
                },
            },
        },
    },
};

const schemaWithOverriddenDefaultType = {
    type: "object",
    properties: {
        param: {
            type: "String",
        },
    },
};

describe("Interface generator", () => {
    let generator: InterfaceGenerator;
    let generatorWithCustomTypes: InterfaceGenerator;

    beforeEach(() => {
        generator = new InterfaceGenerator();
        generatorWithCustomTypes = new InterfaceGenerator(["User"]);
    });

    it("should return empty string if called with empty schema", async () => {
        expect(await generator.createInterface({})).toBe("");
    });

    it("should create simple interface with one number property", async () => {
        const result = await generator.createInterface(simpleSchema);
        expect(result.includes("param?: number;")).toBeTruthy();
    });

    it("should create interface with given name", async () => {
        const name = "User";
        expect((await generator.createInterface(simpleSchema, name))
            .includes(`interface ${name}`)).toBeTruthy();
    });

    it("should generate properties with corresponding optional state", async () => {
        const interfaceString = await generator.createInterface(schemaWithOptionalAndRequiredParams);
        expect((interfaceString).includes("optionalParam?:")).toBeTruthy();
        expect((interfaceString).includes("requiredParam:")).toBeTruthy();
    });

    it("should generate enums", async () => {
        const interfaceString = await generator.createInterface(schemaWithEnum);
        expect((interfaceString).includes("export enum Param")).toBeTruthy();
        expect((interfaceString).includes("param?: Param;")).toBeTruthy();
    });

    it("should generate properties with custom types", async () => {
        const interfaceString = await generatorWithCustomTypes.createInterface(schemaWithCustomType);
        expect((interfaceString).includes("param?: User")).toBeTruthy();
    });

    it("should set optional state depending on 'required'", async () => {
        const interfaceString = await generatorWithCustomTypes.createInterface(schemaWithTwoRequiredCustomTypes);
        expect((interfaceString).includes("param: User")).toBeTruthy();
        expect((interfaceString).includes("param2: User")).toBeTruthy();
    });

    it("should remove fake definitions from generated code", async () => {
        const interfaceString = await generatorWithCustomTypes.createInterface(schemaWithCustomType);
        expect((interfaceString).includes("interface User")).toBeFalsy();
    });

    it("should throw if interface name matches one of custom types", async () => {
        await expect(generatorWithCustomTypes.createInterface(schemaWithCustomType, "User"))
            .rejects.toThrow();
    });

    it("should respect existing definitions is schema", async () => {
        const result = await generatorWithCustomTypes.createInterface(schemaWithTwoCustomTypes);
        expect(result.includes("param?: User")).toBeTruthy();
        expect(result.includes("param2?: Admin")).toBeTruthy();
    });

    it("should fix uppercase for default types", async () => {
        const result = await generator.createInterface(schemaWithUppercaseDefaultTypes);
        expect(result.includes("param1?: string")).toBeTruthy();
        expect(result.includes("param2?: number")).toBeTruthy();
        expect(result.includes("nestedParam1?: boolean")).toBeTruthy();
    });

    it("should not override custom types that match uppercase default types", async () => {
        const generatorWithCustomDefaultValue = new InterfaceGenerator(["String"]);
        const result = await generatorWithCustomDefaultValue.createInterface(schemaWithOverriddenDefaultType);
        expect(result.includes("param?: String")).toBeTruthy();
    });
});
