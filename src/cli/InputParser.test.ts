import * as fs from "fs";
import InputParser from "./InputParser";

const emptyFlags = {};

const cliFlags = {
    source: "cliSource",
    output: "cliOutput",
    name: "cliName",
};

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

    beforeEach(() => {
        existsSpy.mockReturnValue(true);
    });

    afterAll(() => {
        // this is necessary for the correct jest tests execution when mocking fs.existsSync
        // otherwise it will complain about obsolete snapshots
        existsSpy.mockReset();
    });

    it("should throw an error if specified config file does not exist", async () => {
        await expect(inputParser.parse({ config: "/non-existing-config" })).rejects.toThrow();
    });

    it("should not throw an error if default config file does not exists", async () => {
        existsSpy.mockReturnValue(false);
        await expect(inputParser.parse({
            source: "source",
            output: "output",
            name: "name",
        })).resolves.not.toThrow();
    });

    it("should throw an error if any of required flags are missing", async () => {
        await expect(inputParser.parse({ config: "/invalid-config.js" })).rejects.toThrow();
    });

    it("should replace missing 'output' flag with default value", async () => {
        existsSpy.mockReturnValue(false);
        const result = await inputParser.parse({
            source: "source",
        });
        expect(result.runParameters.output).toBe("./");
    });

    it("should replace missing 'grouping' flag with default value 'url'", async () => {
        existsSpy.mockReturnValue(false);
        const result = await inputParser.parse({
            source: "source",
        });
        expect(result.runParameters.grouping).toBe("url");
    });

    it("should not throw an error if 'name' is not specified and grouping is set to 'url'", async () => {
        existsSpy.mockReturnValue(false);
        await expect(inputParser.parse({
            source: "source",
            grouping: "url",
        })).resolves.not.toThrow();
    });

    it("should import config file from a default path if no path was specified", async () => {
        const result = await inputParser.parse(emptyFlags);
        expect(result.runParameters.name).toEqual(defaultConfigFlags.name);
    });

    it("should import config file from specified path", async () => {
        const result = await inputParser.parse({ config: "/config.js" });
        expect(result.runParameters.name).toEqual(configFlags.name);
    });

    it("should map kebab-case CLI flags to camelCase config parameters", async () => {
        existsSpy.mockReturnValue(false);
        const result = await inputParser.parse({
            ...cliFlags,
            "static-postfix": "postfix",
        });
        expect(result.builderOptions.staticPostfix).toBe("postfix");
    });

    it("should ignore CLI flags if config is present", async () => {
        const result = await inputParser.parse({
            config: "/config.js",
            "static-postfix": "cliStaticPostfix",
        });
        expect(result.builderOptions.staticPostfix).toBeUndefined();
    });

    it("should override default config flags with CLI flags", async () => {
        const result = await inputParser.parse({
            "static-prefix": "cliStaticPrefix",
        });
        expect(result.builderOptions.staticPrefix).toBe("cliStaticPrefix");
        expect(result.builderOptions.staticPrefix).not.toBe(defaultConfigFlags.staticPrefix);
    });
});
