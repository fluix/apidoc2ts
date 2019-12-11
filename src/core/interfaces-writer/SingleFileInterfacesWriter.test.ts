import {ApiDoc2InterfaceGroupingMode} from "../ApiDoc2Interface";
import {ConverterResult} from "../endpoint-converter/ApiDocToInterfaceConverter";
import {writeFileToPath} from "../utils/FsUtils";
import {removeConsecutiveBlankLines} from "../utils/StringUtils";
import {stringifyAllInterfaces} from "../utils/WriterUtils";
import {SingleFileInterfacesWriter} from "./SingleFileInterfacesWriter";

jest.mock("../utils/FsUtils");

describe("Single file interfaces writer", () => {
    const writer = new SingleFileInterfacesWriter();

    const requestInterface1 = "interface Request1";
    const responseInterface1 = "interface Response1";
    const errorInterface1 = "interface Error1";

    const errorInterface2 = "interface Error2";
    const requestInterface2 = "interface Request2";
    const responseInterface2 = "interface Response2";

    const converterResults = [
        {
            metadata: {
                name: "GetUser",
            },
            requestInterface: requestInterface1,
            responseInterface: responseInterface1,
            errorInterface: errorInterface1,
            warning: "Invalid type",
        },
        {
            metadata: {
                name: "DarkCave",
            },
            requestInterface: requestInterface2,
            responseInterface: responseInterface2,
            errorInterface: errorInterface2,
            warning: "Spooky ghost",
        },
    ];

    const formattedResults = stringifyAllInterfaces(converterResults as Array<ConverterResult>);

    const args = {
        source: "path/to/the/file",
        output: "path/to/the/output",
        name: "interfaces.ts",
        grouping: ApiDoc2InterfaceGroupingMode.SINGLE,
    };

    const writeFileSpy = (writeFileToPath as jest.Mock).mockImplementation();

    beforeEach(() => {
        writeFileSpy.mockReset();
        writeFileSpy.mockImplementation();
    });

    it("should call writeFile with formatted converter results", async () => {
        await writer.writeInterfaces(converterResults as Array<ConverterResult>, args);
        expect(writeFileSpy).toBeCalledWith(expect.anything(), formattedResults);
    });

    it("should call writeFile with given output path and filename", async () => {
        await writer.writeInterfaces(converterResults as Array<ConverterResult>, args);
        expect(writeFileSpy).toBeCalledWith("path/to/the/output/interfaces.ts", expect.anything());
    });
});

describe("consecutive blank lines fixer", () => {
    it("should remove consecutive blank lines", () => {
        expect(removeConsecutiveBlankLines("interface1\n\n\ninterface2"))
            .toEqual("interface1\n\ninterface2");
    });

    it("should remove consecutive blank lines in several places", () => {
        expect(removeConsecutiveBlankLines("i1\n\n\ni2\n\n\n\ni3"))
            .toEqual("i1\n\ni2\n\ni3");
    });

    it("should leave only one newline in end of string", () => {
        expect(removeConsecutiveBlankLines("i1\n\n"))
            .toEqual("i1\n");
    });
});
