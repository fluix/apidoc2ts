import {InputParser} from "./InputParser";
import * as fs from "fs";

const configParameters = {
    source: "source",
    output: "output",
    name: "name",
    requestPostfix: "",
    errorPrefix: "prefix",
};

const flags = {
    config: "/config.js",
    "static-prefix": "prefix",
    "request-postfix": "requestPostfix",
};

jest.mock(`${process.cwd()}/config.js`, () => (configParameters), {
    virtual: true,
});

jest.mock(`${process.cwd()}/apidoc2ts.config.js`, () => (configParameters), {
    virtual: true,
});

describe("CLI InputParser", () => {
    const parser = new InputParser();
    const existsSpy = jest.spyOn(fs, "existsSync");

    beforeEach(() => {
        existsSpy.mockReset();
        existsSpy.mockImplementation(() => true);
    });

    it("should throw an error if some of required parameters are missing", async () => {
        existsSpy.mockImplementationOnce(() => false);
        await expect(parser.parse({})).rejects.toThrow();
    });

    it("should import config file from a default path if no path was specified", async () => {
        const result = await parser.parse({});
        expect(result.builderOptions.errorPrefix).toEqual(configParameters.errorPrefix);
    });

    it("should import config file from specified path", async () => {
        const result = await parser.parse(flags);
        expect(result.builderOptions.errorPrefix).toEqual(configParameters.errorPrefix);
    });

    it("should map CLI flags to config parameters", async () => {
        const result = await parser.parse(flags);
        expect(result.builderOptions.staticPrefix).toEqual(flags["static-prefix"]);
    });

    it("should rewrite config parameters with flags", async () => {
        const result = await parser.parse(flags);
        expect(result.builderOptions.requestPostfix).toEqual(flags["request-postfix"]);
    });
});
