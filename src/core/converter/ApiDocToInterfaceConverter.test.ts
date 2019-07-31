import {ApiDocToInterfaceConverter} from "./ApiDocToInterfaceConverter";
import {InterfaceGenerator} from "../generator/InterfaceGenerator";
import {ApiDocEndpointParser} from "../parser/ApiDocEndpointParser";

const requestVersion1 = {
    type: "post",
    url: "/user",
    version: "0.0.1",
    name: "PostBook",
    group: "Book",
    filename: "source/example_full/example.js",
    parameter: {
        fields: {
            Parameter: [
                {
                    type: "string",
                    field: "name",
                },
            ],
        },
    },
};

const requestVersion2 = {
    type: "post",
    url: "/user",
    version: "0.0.2",
    name: "PostBook",
    group: "Book",
    filename: "source/example_full/example.js",
    parameter: {
        fields: {
            Parameter: [
                {
                    type: "string",
                    field: "name",
                },
            ],
        },
    },
};

const requestVersion3 = {
    type: "post",
    url: "/user",
    version: "0.1.0",
    name: "PostBook",
    group: "Book",
    filename: "source/example_full/example.js",
    parameter: {
        fields: {
            Parameter: [
                {
                    type: "string",
                    field: "name",
                },
            ],
        },
    },
};

jest.mock("../parser/ApiDocEndpointParser");
jest.mock("../generator/InterfaceGenerator");

const apiDocDataFull = [requestVersion1, requestVersion2, requestVersion3];

const parserResultMock = {
    request: {type: "requestMock"},
    response: {type: "responseMock"},
    error: {type: "errorMock"},
};

describe("ApiDoc to Interface converter", () => {
    const interfaceGenerator = new InterfaceGenerator();
    const apiDocEndpoint: ApiDocEndpointParser = new ApiDocEndpointParser();
    const parseEndpointSpy = jest.spyOn(apiDocEndpoint, "parseEndpoint");

    let converter: ApiDocToInterfaceConverter;

    beforeEach(() => {
        (interfaceGenerator.createInterface as jest.Mock).mockReset();
        parseEndpointSpy.mockReset();
        parseEndpointSpy.mockImplementation(() => parserResultMock);

        converter = new ApiDocToInterfaceConverter(interfaceGenerator, apiDocEndpoint);
    });

    it("should return empty array for empty data", async () => {
        expect(await converter.convert([])).toEqual([]);
    });

    it("should call parseEndpoint with apiDoc data", async () => {
        await converter.convert([requestVersion1]);
        expect(parseEndpointSpy).toBeCalledWith(requestVersion1);
    });

    it("should call createInterface with parsed schemas for request, response and error", async () => {
        await converter.convert([requestVersion1]);
        expect(interfaceGenerator.createInterface).toBeCalledWith(parserResultMock.request, expect.anything());
        expect(interfaceGenerator.createInterface).toBeCalledWith(parserResultMock.response, expect.anything());
        expect(interfaceGenerator.createInterface).toBeCalledWith(parserResultMock.error, expect.anything());
    });

    it("should call createInterface with name from apiDoc endpoint and default postfixes", async () => {
        await converter.convert([requestVersion1]);
        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(), requestVersion1.name);
        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(), `${requestVersion1.name}Response`);
        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(), `${requestVersion1.name}Error`);
    });

    it("should call parseEndpoint and createInterface for every endpoint", async () => {
        await converter.convert(apiDocDataFull);
        expect(parseEndpointSpy).toBeCalledTimes(apiDocDataFull.length);
        expect(interfaceGenerator.createInterface).toBeCalledTimes(apiDocDataFull.length * 3);
    });

    it("should add version postfix to interface if it is not the latest one", async () => {
        await converter.convert([requestVersion1, requestVersion2, requestVersion3]);
        expect(interfaceGenerator.createInterface)
            .toBeCalledWith(expect.anything(), `${requestVersion1.name}_v${requestVersion1.version}`);
        expect(interfaceGenerator.createInterface)
            .toBeCalledWith(expect.anything(), `${requestVersion2.name}_v${requestVersion2.version}`);
        expect(interfaceGenerator.createInterface)
            .toBeCalledWith(expect.anything(), `${requestVersion3.name}`);
    });

    it("should add warning message if there was an error while parsing or converting", async () => {
        parseEndpointSpy.mockImplementationOnce(() => {
            throw new Error("Mocked error while parsing");
        });
        const results = await converter.convert([requestVersion1, requestVersion2]);
        expect(results[0].warning).toBe("Mocked error while parsing");
        expect(results[1].warning).toBeUndefined();
    });
});
