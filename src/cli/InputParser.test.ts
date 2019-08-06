import * as fs from "fs";
import {InputParser} from "./InputParser";

const emptyConfig = {};

const configFlags = {
    source: "source",
    output: "output",
    name: "name",
    requestPostfix: "",
    responsePrefix: "prefix",
};

const defaultConfigFlags = {
    source: "source",
    output: "output",
    name: "name",
    errorPrefix: "prefix",
};

const cliFlags = {
    config: "/config.js",
    "static-prefix": "prefix",
    "request-postfix": "requestPostfix",
};

jest.mock(`${process.cwd()}/config.js`, () => (configFlags), {
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

    it("should throw an error if some of required flags are missing", async () => {
        existsSpy.mockReturnValueOnce(false);
        await expect(inputParser.parse(emptyConfig)).rejects.toThrow();
    });

    it("should import config file from a default path if no path was specified", async () => {
        const result = await inputParser.parse(emptyConfig);
        expect(result.builderOptions.errorPrefix).toEqual(defaultConfigFlags.errorPrefix);
    });

    it("should import config file from specified path", async () => {
        const result = await inputParser.parse(cliFlags);
        expect(result.builderOptions.responsePrefix).toEqual(configFlags.responsePrefix);
    });

    it("should map kebab-case CLI flags to camelCase config parameters", async () => {
        const result = await inputParser.parse(cliFlags);
        expect(result.builderOptions.staticPrefix).toEqual(cliFlags["static-prefix"]);
    });

    it("should rewrite config flags with CLI input flags", async () => {
        const result = await inputParser.parse(cliFlags);
        expect(result.builderOptions.requestPostfix).toEqual(cliFlags["request-postfix"]);
    });
});
