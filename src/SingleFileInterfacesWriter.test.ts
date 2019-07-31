import {SingleFileInterfacesWriter} from "./SingleFileInterfacesWriter";
import {ConverterResult} from "./ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceGroupingMode} from "./ApiDoc2Interface";
import {stringifyAllInterfaces} from "./InterfacesWriter";
import * as path from "path";
import {writeFileToPath} from "./fs-utils";

jest.mock("./fs-utils");

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
        expect(writeFileSpy).toBeCalledWith(path.join(args.output, args.name), expect.anything());
    });
});
