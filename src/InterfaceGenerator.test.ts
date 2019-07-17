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
            $ref: "#/definitions/User",
        },
    },
    definitions: {
        User: {
            type: "object",
            properties: {
                prop: {},
            },
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

describe("Interface generator", () => {
    let generator: InterfaceGenerator;

    beforeEach(() => {
        generator = new InterfaceGenerator();
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
        const interfaceString = await generator.createInterface(schemaWithCustomType);
        expect((interfaceString).includes("param?: User")).toBeTruthy();
    });

    it("should remove fake definitions from generated code", async () => {
        const generatorWithCustomTypes = new InterfaceGenerator(["User"]);
        const interfaceString = await generatorWithCustomTypes.createInterface(schemaWithCustomType);
        expect((interfaceString).includes("interface User")).toBeFalsy();
    });

    it("should throw if interface name matches one of custom types", async () => {
        const generatorWithCustomTypes = new InterfaceGenerator(["User"]);
        await expect(generatorWithCustomTypes.createInterface(schemaWithCustomType, "User"))
            .rejects.toThrow();
    });
});
