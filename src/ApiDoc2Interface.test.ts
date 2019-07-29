import * as fs from "fs";
import * as path from "path";
import {ApiDoc2Interface, ApiDoc2InterfaceExitCode} from "./ApiDoc2Interface";
import {ApiDocToInterfaceConverter} from "./ApiDocToInterfaceConverter";

jest.mock("fs");
jest.mock("./ApiDocToInterfaceConverter");

describe("ApiDoc2Interface wrapper", () => {
    const requestInterface = "interface Request";
    const responseInterface = "interface Response";
    const errorInterface = "interface Error";

    const converter = {
        convert: jest.fn(() => ([
            {
                requestInterface,
                responseInterface,
                errorInterface,
            },
        ])),
    };
    const apiDoc2Interface = new ApiDoc2Interface(converter as unknown as ApiDocToInterfaceConverter);
    const args = {
        source: "path/to/the/file",
        output: "path/to/the/output",
        name: "interfaces.ts",
    };

    const readFileSpy = jest.spyOn(fs, "readFile");
    const writeFileSpy = jest.spyOn(fs, "writeFile");

    beforeEach(() => {
        readFileSpy.mockReset();
        readFileSpy.mockImplementation(((a, b, callback) => {
            callback(null, "{\"mock\": \"data\"}");
        }) as any);

        writeFileSpy.mockReset();
        writeFileSpy.mockImplementation((a, b, callback) => {
            callback(null);
        });
    });

    it("should call readFile with given path", async () => {
        await apiDoc2Interface.run(args);
        expect(readFileSpy).toBeCalledWith(args.source, "utf-8", expect.anything());
    });

    it("should throw an error when readFile failed", async () => {
        readFileSpy.mockImplementation(() => {
            throw new Error("Mocked error while reading file");
        });
        const result = await apiDoc2Interface.run(args);
        expect(result.code).toBe(ApiDoc2InterfaceExitCode.FAIL);
    });

    it("should call converter with parsed data", async () => {
        await apiDoc2Interface.run(args);
        expect(converter.convert).toBeCalledWith({mock: "data"});
    });

    it("should call writeFile with formatted converter results", async () => {
        const formattedResults = `${requestInterface}\n${responseInterface}\n${errorInterface}`;
        await apiDoc2Interface.run(args);
        expect(writeFileSpy).toBeCalledWith(expect.anything(), formattedResults, expect.anything());
    });

    it("should call writeFile with given output path and filename", async () => {
        await apiDoc2Interface.run(args);
        expect(writeFileSpy).toBeCalledWith(path.join(args.output, args.name), expect.anything(), expect.anything());
    });

    it("should return fail code if writeFile failed", async () => {
        writeFileSpy.mockImplementation(() => {
            throw new Error("Mocked error while writing file");
        });
        const result = await apiDoc2Interface.run(args);
        expect(result.code).toBe(ApiDoc2InterfaceExitCode.FAIL);
    });

    it("should return success code if there was no errors", async () => {
        const result = await apiDoc2Interface.run(args);
        expect(result.code).toBe(ApiDoc2InterfaceExitCode.SUCCESS);
    });
});
