import {InputParser} from "./InputParser";
import * as fs from "fs";

const configFlags = {
    source: "source",
    output: "output",
    name: "name",
    requestPostfix: "",
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

jest.mock(`${process.cwd()}/apidoc2ts.config.js`, () => (configFlags), {
    virtual: true,
});

describe("CLI InputParser", () => {
    const parser = new InputParser();
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
        await expect(parser.parse({})).rejects.toThrow();
    });

    it("should import config file from a default path if no path was specified", async () => {
        const result = await parser.parse({});
        expect(result.builderOptions.errorPrefix).toEqual(configFlags.errorPrefix);
    });

    it("should import config file from specified path", async () => {
        const result = await parser.parse(cliFlags);
        expect(result.builderOptions.errorPrefix).toEqual(configFlags.errorPrefix);
    });

    it("should map CLI flags to config parameters", async () => {
        const result = await parser.parse(cliFlags);
        expect(result.builderOptions.staticPrefix).toEqual(cliFlags["static-prefix"]);
    });

    it("should rewrite config flags with CLI input flags", async () => {
        const result = await parser.parse(cliFlags);
        expect(result.builderOptions.requestPostfix).toEqual(cliFlags["request-postfix"]);
    });
});
