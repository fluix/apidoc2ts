import * as fs from "fs";
import {InputParser} from "./InputParser";

const emptyConfig = {};

const configFlags = {
    source: "configSource",
    output: "configOutput",
    name: "configName",
};

const defaultConfigFlags = {
    source: "defaultConfigSource",
    output: "defaultConfigOutput",
    name: "defaultConfigName",
    staticPrefix: "defaultConfigStaticPrefix",
};

const invalidConfigFlags = {};

jest.mock(`${process.cwd()}/config.js`, () => (configFlags), {
    virtual: true,
});

jest.mock(`${process.cwd()}/invalid-config.js`, () => (invalidConfigFlags), {
    virtual: true,
});

jest.mock(`${process.cwd()}/apidoc2ts.config.js`, () => (defaultConfigFlags), {
    virtual: true,
});

describe("CLI InputParser", () => {
    const inputParser = new InputParser();
    const existsSpy = jest.spyOn(fs, "existsSync");

    beforeAll(() => {
        existsSpy.mockReturnValue(true);
    });

    afterAll(() => {
        // this is necessary for the correct jest tests execution when mocking fs.existsSync
        // otherwise it will complain about obsolete snapshots
        existsSpy.mockReset();
    });

    it("should throw an error if specified config file does not exist", async () => {
        await expect(inputParser.parse({config: "/non-existing-config"})).rejects.toThrow();
    });

    it("should throw an error if any of required flags are missing", async () => {
        await expect(inputParser.parse({config: "invalid-config.js"})).rejects.toThrow();
    });

    it("should import config file from a default path if no path was specified", async () => {
        const result = await inputParser.parse(emptyConfig);
        expect(result.runParameters.name).toEqual(defaultConfigFlags.name);
    });

    it("should import config file from specified path", async () => {
        const result = await inputParser.parse({config: "/config.js"});
        expect(result.runParameters.name).toEqual(configFlags.name);
    });

    it("should map kebab-case CLI flags to camelCase config parameters", async () => {
        const result = await inputParser.parse({"static-postfix": "postfix"});
        expect(result.builderOptions.staticPostfix).toBe("postfix");
    });

    it("should rewrite config flags with CLI input flags", async () => {
        const result = await inputParser.parse({"static-prefix": "cliStaticPrefix"});
        expect(result.builderOptions.staticPrefix).toEqual("cliStaticPrefix");
        expect(result.builderOptions.staticPrefix).not.toEqual(defaultConfigFlags.staticPrefix);
    });
});
