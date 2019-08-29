import * as fs from "fs";
import {ApiDoc2Interface, ApiDoc2InterfaceExitCode, ApiDoc2InterfaceGroupingMode} from "./ApiDoc2Interface";
import {ApiDocToInterfaceConverter} from "./endpoint-converter/ApiDocToInterfaceConverter";

jest.mock("fs");
jest.mock("./endpoint-converter/ApiDocToInterfaceConverter");

describe("ApiDoc2Interface wrapper", () => {
    const requestInterface = "interface Request";
    const responseInterface = "interface Response";
    const errorInterface = "interface Error";

    const converterResults = [
        {
            requestInterface,
            responseInterface,
            errorInterface,
        },
    ];

    const converter = {
        convert: jest.fn(() => (converterResults)),
    };

    const writeInterfacesMock = jest.fn((a, b) => Promise.resolve());
    const interfaceWriterFactoryMock = jest.fn((grouping) => ({
        writeInterfaces: writeInterfacesMock,
    }));

    const apiDoc2Interface = new ApiDoc2Interface(
        converter as unknown as ApiDocToInterfaceConverter,
        interfaceWriterFactoryMock,
    );
    const args = {
        source: "path/to/the/file",
        output: "path/to/the/output",
        name: "interfaces.ts",
        grouping: ApiDoc2InterfaceGroupingMode.SINGLE,
    };

    const readFileSpy = jest.spyOn(fs, "readFile");

    beforeEach(() => {
        readFileSpy.mockReset();
        readFileSpy.mockImplementation(((a, b, callback) => {
            callback(null, "{\"mock\": \"data\"}");
        }) as any);

        writeInterfacesMock.mockReset();
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

    it("should call writer factory with grouping mode", async () => {
        await apiDoc2Interface.run(args);
        expect(interfaceWriterFactoryMock).toBeCalledWith(args.grouping);
    });

    it("should call writeInterfaces with converter results and arguments", async () => {
        await apiDoc2Interface.run(args);
        expect(writeInterfacesMock).toBeCalledWith(converterResults, args);
    });

    it("should return fail code if writing failed", async () => {
        writeInterfacesMock.mockImplementation(() => {
            throw new Error("Mocked error while writing interfaces");
        });
        const result = await apiDoc2Interface.run(args);
        expect(result.code).toBe(ApiDoc2InterfaceExitCode.FAIL);
    });

    it("should return success code if there were no errors", async () => {
        const result = await apiDoc2Interface.run(args);
        expect(result.code).toBe(ApiDoc2InterfaceExitCode.SUCCESS);
    });

    it("should return no warnings if there were no errors while converting or parsing", async () => {
        const result = await apiDoc2Interface.run(args);
        expect(result.warnings).toEqual([]);
    });

    it("should return warning messages for every endpoint error", async () => {
        converter.convert.mockImplementationOnce(() => ([
            {
                metadata: {
                    name: "GetUser",
                },
                requestInterface: "",
                responseInterface: "",
                errorInterface: "",
                warning: "Invalid type",
            },
            {
                metadata: {
                    name: "DarkCave",
                },
                requestInterface: "",
                responseInterface: "",
                errorInterface: "",
                warning: "Spooky ghost",
            },
        ]));
        const result = await apiDoc2Interface.run(args);
        expect(result.warnings).toHaveLength(2);
        expect(result.warnings[0]).toBe("GetUser: Invalid type");
        expect(result.warnings[1]).toBe("DarkCave: Spooky ghost");
    });
});
