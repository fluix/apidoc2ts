import {ConverterResult} from "../converter/ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceGroupingMode} from "../ApiDoc2Interface";
import {UrlStructureInterfacesWriter} from "./UrlStructureInterfacesWriter";
import {stringifyInterfaces} from "./InterfacesWriter";
import {writeFileToPath} from "../FsUtils";
import * as path from "path";

jest.mock("../FsUtils");

describe("Single file interfaces writer", () => {
    const writer = new UrlStructureInterfacesWriter();

    const requestInterface1 = "interface Request1";
    const responseInterface1 = "interface Response1";
    const errorInterface1 = "interface Error1";

    const errorInterface2 = "interface Error2";
    const requestInterface2 = "interface Request2";
    const responseInterface2 = "interface Response2";

    const converterResults: Array<ConverterResult> = ([
        {
            metadata: {
                name: "GetUser",
                url: "/api/sample/user",
            },
            requestInterface: requestInterface1,
            responseInterface: responseInterface1,
            errorInterface: errorInterface1,
            warning: "Invalid type",
        },
        {
            metadata: {
                name: "DarkCave",
                url: "/api/sample/user/:user",
            },
            requestInterface: requestInterface2,
            responseInterface: responseInterface2,
            errorInterface: errorInterface2,
            warning: "Spooky ghost",
        },
    ] as Array<ConverterResult>);

    const formattedResults1 = stringifyInterfaces(converterResults[0]);
    const formattedResults2 = stringifyInterfaces(converterResults[1]);

    const args = {
        source: "path/to/the/file",
        output: "path/to/the/output",
        name: "interfaces.ts",
        grouping: ApiDoc2InterfaceGroupingMode.URL,
    };

    const writeFileSpy = (writeFileToPath as jest.Mock).mockImplementation();

    it("should call writeFile for every endpoint interfaces", async () => {
        await writer.writeInterfaces(converterResults, args);
        expect(writeFileSpy).toBeCalledTimes(2);
    });

    it("should call writeFile for endpoint interfaces based on URL", async () => {
        await writer.writeInterfaces(converterResults, args);

        expect(writeFileSpy).toBeCalledWith(
            path.join(args.output, converterResults[0].metadata.url, `${converterResults[0].metadata.name}.ts`),
            expect.anything(),
        );
    });

    it("should call writeFile without URL params", async () => {
        await writer.writeInterfaces(converterResults, args);

        expect(writeFileSpy).toBeCalledWith(
            path.join(args.output, "/api/sample/user", `${converterResults[1].metadata.name}.ts`),
            expect.anything(),
        );
    });

    it("should call writeFile with formatted interfaces for every endpoint", async () => {
        await writer.writeInterfaces(converterResults, args);

        expect(writeFileSpy).toBeCalledWith(
            expect.anything(),
            formattedResults1,
        );

        expect(writeFileSpy).toBeCalledWith(
            expect.anything(),
            formattedResults2,
        );
    });
});
