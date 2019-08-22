import {InterfaceGenerator} from "../generator/InterfaceGenerator";
import {ApiDocEndpointParser} from "../parser/ApiDocEndpointParser";
import {ApiDocExamplesParser} from "../parser/ApiDocExamplesParser";
import {ApiDocToInterfaceConverter, ConverterVersionResolving} from "./ApiDocToInterfaceConverter";

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

const otherRequest = {
    type: "get",
    url: "/book",
    version: "0.1.0",
    name: "GetBook",
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

const requestExample = ' { "name": "username", "age": 12 }';

const requestWithExamples = {
    type: "get",
    url: "/book",
    version: "0.1.0",
    name: "GetBook",
    group: "Book",
    filename: "source/example_full/example.js",
    parameter: {
        examples: [
            {
                title: "title",
                type: "json",
                content: requestExample,
            },
        ],
    },
};

const requestWithFieldsAndExamplesInDifferentParts = {
    type: "get",
    url: "/book",
    version: "0.1.0",
    name: "GetBook",
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
    success: {
        examples: [
            {
                title: "title",
                type: "json",
                content: requestExample,
            },
        ],
    },
};

const emptyRequest = {
    type: "get",
    url: "/book",
    version: "0.1.0",
    name: "GetBook",
    group: "Book",
    filename: "source/example_full/example.js",
};

jest.mock("../parser/ApiDocEndpointParser");
jest.mock("../parser/ApiDocExamplesParser");
jest.mock("../generator/InterfaceGenerator");

const threeEndpoints = [requestVersion1, requestVersion2, requestVersion3];

const parserResultMock = {
    request: {type: "requestMock"},
    response: {type: "responseMock"},
    error: {type: "errorMock"},
};

const interfacesPerEndpoint = 3; // request, success response, error response

describe("ApiDoc to Interface converter", () => {
    const interfaceGenerator = new InterfaceGenerator();
    const endpointParser = new ApiDocEndpointParser();
    const examplesParser = new ApiDocExamplesParser();
    const parseEndpointSpy = jest.spyOn(endpointParser, "parseEndpoint");

    const converter = new ApiDocToInterfaceConverter(interfaceGenerator, endpointParser);
    const defaultOptions = {
        versionResolving: ConverterVersionResolving.ALL,
        staticPrefix: "",
        staticPostfix: "",
        requestPrefix: "",
        requestPostfix: "",
        responsePrefix: "",
        responsePostfix: "",
        errorPrefix: "",
        errorPostfix: "",
        whitelist: [],
        parseExamples: false,
    };
    const converterWithLatestOption = new ApiDocToInterfaceConverter(interfaceGenerator, endpointParser,
        {
            ...defaultOptions,
            versionResolving: ConverterVersionResolving.LAST,
        },
    );
    const converterWithEmptyWhitelist = new ApiDocToInterfaceConverter(interfaceGenerator, endpointParser,
        defaultOptions,
    );
    const converterWithWhitelist = new ApiDocToInterfaceConverter(interfaceGenerator, endpointParser,
        {
            ...defaultOptions,
            whitelist: ["PostBook"],
        },
    );
    const converterWithExamplesParser = new ApiDocToInterfaceConverter(
        interfaceGenerator,
        endpointParser,
        {
            ...defaultOptions,
            parseExamples: true,
        },
        examplesParser,
    );

    const prefixPostfixOptions = {
        staticPrefix: "prefix",
        staticPostfix: "postFix",
        requestPrefix: "requestPrefix",
        requestPostfix: "requestPostfix",
        responsePrefix: "responsePrefix",
        responsePostfix: "responsePostfix",
        errorPrefix: "errorPrefix",
        errorPostfix: "errorPostfix",
    };

    const converterWithCustomPrefixPostfix = new ApiDocToInterfaceConverter(
        interfaceGenerator,
        endpointParser,
        {
            ...defaultOptions,
            ...prefixPostfixOptions,
        },
    );

    beforeEach(() => {
        (interfaceGenerator.createInterface as jest.Mock).mockReset();
        parseEndpointSpy.mockReset();
        parseEndpointSpy.mockImplementation(() => parserResultMock);
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

    it("should call createInterface with passed in prefixes and postfixes", async () => {
        await converterWithCustomPrefixPostfix.convert([requestVersion1]);
        const {
            staticPrefix,
            staticPostfix,
            requestPrefix,
            requestPostfix,
            responsePrefix,
            responsePostfix,
            errorPrefix,
            errorPostfix,
        } = prefixPostfixOptions;

        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(),
            `${staticPrefix}${requestPrefix}${requestVersion1.name}${requestPostfix}${staticPostfix}`,
        );
        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(),
            `${staticPrefix}${responsePrefix}${requestVersion1.name}${responsePostfix}${staticPostfix}`,
        );
        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(),
            `${staticPrefix}${errorPrefix}${requestVersion1.name}${errorPostfix}${staticPostfix}`,
        );
    });

    it("should call parseEndpoint and createInterface for every endpoint", async () => {
        await converter.convert(threeEndpoints);
        expect(parseEndpointSpy).toBeCalledTimes(threeEndpoints.length);
        expect(interfaceGenerator.createInterface).toBeCalledTimes(threeEndpoints.length * interfacesPerEndpoint);
    });

    it("should add version postfix to interface name if it is not the latest one", async () => {
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

    it("should not create interfaces for older versions if version resolving option is set to 'latest'", async () => {
        const results = await converterWithLatestOption.convert(threeEndpoints);
        expect(results[0].requestInterface).toBe("");
        expect(results[1].requestInterface).toBe("");
        expect(results[2].requestInterface).not.toBe("");
    });

    it("should create warnings for skipped older endpoints", async () => {
        const results = await converterWithLatestOption.convert(threeEndpoints);
        expect(results[0].warning).toBe("Skipping older version [0.0.1]");
        expect(results[1].warning).toBe("Skipping older version [0.0.2]");
        expect(results[2].warning).toBeUndefined();
    });

    it("should create interfaces for all endpoints if whitelist is not specified", async () => {
        await converterWithEmptyWhitelist.convert(threeEndpoints);
        expect(parseEndpointSpy).toBeCalledTimes(threeEndpoints.length);
        expect(interfaceGenerator.createInterface).toBeCalledTimes(threeEndpoints.length * interfacesPerEndpoint);
    });

    it("should create interfaces only for whitelisted endpoints", async () => {
        const apiDocEndpoints = [requestVersion1, otherRequest];
        await converterWithWhitelist.convert(apiDocEndpoints);
        expect(parseEndpointSpy).toBeCalledTimes(1);
        expect(interfaceGenerator.createInterface).toBeCalledTimes(1 * interfacesPerEndpoint);
    });

    it("should not call parseExamples if endpoint has parameters", async () => {
        await converterWithExamplesParser.convert([requestVersion1]);
        expect(examplesParser.parse).not.toBeCalled();
    });

    it("should call parseExamples if endpoint has no parameters but has examples", async () => {
        parseEndpointSpy.mockImplementation(() => {
            throw new Error("Mocked error while parsing");
        });
        await converterWithExamplesParser.convert([requestWithExamples]);
        expect(examplesParser.parse).toBeCalled();
    });

    it("should create warning message if there were no parameters nor examples", async () => {
        parseEndpointSpy.mockImplementation(() => {
            throw new Error("Mocked error while parsing");
        });
        const results = await converterWithExamplesParser.convert([emptyRequest]);
        expect(results[0].warning).toBe("Endpoint has no parameters nor examples");
    });

    it("should combine interfaces got from fields and from examples", async () => {
        (interfaceGenerator.createInterface as jest.Mock).mockReturnValueOnce("mock fields interface");
        (examplesParser.parse as jest.Mock)
            .mockReturnValueOnce("")
            .mockReturnValueOnce("mock examples interface");

        const results = await converterWithExamplesParser.convert(
            [requestWithFieldsAndExamplesInDifferentParts],
        );

        expect(results[0].requestInterface).toBeDefined();
        expect(results[0].responseInterface).toBeDefined();
        expect(results[0].errorInterface).toBeUndefined();
    });
});
