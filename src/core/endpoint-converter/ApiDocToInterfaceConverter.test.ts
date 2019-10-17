import {ApiDocExamplesParser} from "../endpoint-parser/ApiDocExamplesParser";
import {ApiDocFieldsParser} from "../endpoint-parser/ApiDocFieldsParser";
import {InterfaceGenerator} from "../interface-generator/InterfaceGenerator";
import {
    ApiDocToInterfaceConverter,
    converterDefaultOptions,
    ConverterMessages,
    ConverterVersionResolving,
} from "./ApiDocToInterfaceConverter";

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

jest.mock("../endpoint-parser/ApiDocFieldsParser");
jest.mock("../endpoint-parser/ApiDocExamplesParser");
jest.mock("../interface-generator/InterfaceGenerator");

const threeEndpoints = [requestVersion1, requestVersion2, requestVersion3];

const parserResultMock = {
    request: {type: "requestMock"},
    response: {type: "responseMock"},
    error: {type: "errorMock"},
};

const parserEmptyResultMock = {
    request: {},
    response: {},
    error: {},
};

const interfacesPerEndpoint = 3; // request, success response, error response

describe("ApiDoc to Interface converter", () => {
    const interfaceGenerator = new InterfaceGenerator();
    const endpointParser = new ApiDocFieldsParser();
    const examplesParser = new ApiDocExamplesParser();

    const parseEndpointSpy = jest.spyOn(endpointParser, "parseEndpoint");
    const createInterfaceSpy = jest.spyOn(interfaceGenerator, "createInterface");

    const converter = new ApiDocToInterfaceConverter(interfaceGenerator, endpointParser);
    const converterWithLatestOption = new ApiDocToInterfaceConverter(interfaceGenerator, endpointParser,
        {
            ...converterDefaultOptions,
            versionResolving: ConverterVersionResolving.LAST,
        });
    const converterWithEmptyWhitelist = new ApiDocToInterfaceConverter(interfaceGenerator, endpointParser,
        {
            ...converterDefaultOptions,
            whitelist: [],
        });
    const converterWithWhitelist = new ApiDocToInterfaceConverter(interfaceGenerator, endpointParser,
        {
            ...converterDefaultOptions,
            whitelist: ["PostBook"],
        });

    beforeEach(() => {
        createInterfaceSpy.mockReset();
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
        expect(createInterfaceSpy).toBeCalledWith(parserResultMock.request, expect.anything());
        expect(createInterfaceSpy).toBeCalledWith(parserResultMock.response, expect.anything());
        expect(createInterfaceSpy).toBeCalledWith(parserResultMock.error, expect.anything());
    });

    describe("for a custom naming function", () => {
        const interfaceNameOptions = {
            staticPrefix: "prefix",
            staticPostfix: "postFix",
            requestPrefix: "requestPrefix",
            requestPostfix: "requestPostfix",
            responsePrefix: "responsePrefix",
            responsePostfix: "responsePostfix",
            errorPrefix: "errorPrefix",
            errorPostfix: "errorPostfix",
        };

        const namingFunctionMock = jest.fn();

        const converterWithCustomNamingFunction = new ApiDocToInterfaceConverter(
            interfaceGenerator,
            endpointParser,
            {
                ...converterDefaultOptions,
                ...interfaceNameOptions,
                makeName: namingFunctionMock,
            },
        );

        it("should call naming function for creating names for interfaces", async () => {
            await converterWithCustomNamingFunction.convert([requestVersion1]);
            expect(namingFunctionMock).toBeCalledTimes(1 * interfacesPerEndpoint);
        });

        it("should call naming function with passed in prefixes and postfixes", async () => {
            await converterWithCustomNamingFunction.convert([requestVersion1]);

            const commonOptions = {
                staticPrefix: interfaceNameOptions.staticPrefix,
                staticPostfix: interfaceNameOptions.staticPostfix,
            };

            expect(namingFunctionMock).toBeCalledWith(requestVersion1, true,
                {
                    ...commonOptions,
                    prefix: interfaceNameOptions.requestPrefix,
                    postfix: interfaceNameOptions.requestPostfix,
                });
            expect(namingFunctionMock).toBeCalledWith(requestVersion1, true,
                {
                    ...commonOptions,
                    prefix: interfaceNameOptions.responsePrefix,
                    postfix: interfaceNameOptions.responsePostfix,
                });
            expect(namingFunctionMock).toBeCalledWith(requestVersion1, true,
                {
                    ...commonOptions,
                    prefix: interfaceNameOptions.errorPrefix,
                    postfix: interfaceNameOptions.errorPostfix,
                });
        });

        it("should call createInterface with naming function result", async () => {
            namingFunctionMock.mockReturnValueOnce("mock interface name");
            await converterWithCustomNamingFunction.convert([requestVersion1]);
            expect(createInterfaceSpy).toBeCalledWith(expect.anything(), "mock interface name");
        });
    });

    it("should call parseEndpoint and createInterface for every endpoint", async () => {
        await converter.convert(threeEndpoints);
        expect(parseEndpointSpy).toBeCalledTimes(threeEndpoints.length);
        expect(createInterfaceSpy).toBeCalledTimes(threeEndpoints.length * interfacesPerEndpoint);
    });

    it("should add warning message if there was some trouble while parsing or converting", async () => {
        createInterfaceSpy
            .mockReturnValueOnce(Promise.resolve(""))
            .mockReturnValueOnce(Promise.resolve(""))
            .mockReturnValueOnce(Promise.resolve(""));
        const results = await converter.convert([requestVersion1]);
        expect(results[0].warning).toBeDefined();
    });

    it("should not create interfaces for older versions if version resolving option is set to 'latest'", async () => {
        createInterfaceSpy.mockReturnValueOnce(Promise.resolve("mock fields interface"));
        const results = await converterWithLatestOption.convert(threeEndpoints);
        expect(results[0].requestInterface).toBe("");
        expect(results[1].requestInterface).toBe("");
        expect(results[2].requestInterface).not.toBe("");
    });

    it("should create warnings for skipped older endpoints", async () => {
        createInterfaceSpy.mockReturnValue(Promise.resolve("mock fields interface"));
        const results = await converterWithLatestOption.convert(threeEndpoints);
        expect(results[0].warning).toContain(ConverterMessages.SKIP_OLD_ENDPOINT);
        expect(results[1].warning).toContain(ConverterMessages.SKIP_OLD_ENDPOINT);
        expect(results[2].warning).toBeUndefined();
    });

    it("should create interfaces for all endpoints if whitelist is not specified", async () => {
        await converterWithEmptyWhitelist.convert(threeEndpoints);
        expect(parseEndpointSpy).toBeCalledTimes(threeEndpoints.length);
        expect(createInterfaceSpy).toBeCalledTimes(threeEndpoints.length * interfacesPerEndpoint);
    });

    it("should create interfaces only for whitelisted endpoints", async () => {
        const apiDocEndpoints = [requestVersion1, otherRequest];
        await converterWithWhitelist.convert(apiDocEndpoints);
        expect(parseEndpointSpy).toBeCalledTimes(1);
        expect(createInterfaceSpy).toBeCalledTimes(1 * interfacesPerEndpoint);
    });

    describe("when parsing examples", () => {
        const converterWithExamplesParser = new ApiDocToInterfaceConverter(
            interfaceGenerator,
            endpointParser,
            {
                ...converterDefaultOptions,
                parseExamples: true,
            },
            examplesParser,
        );

        it("should not call parseExamples if endpoint has parameters", async () => {
            await converterWithExamplesParser.convert([requestVersion1]);
            expect(examplesParser.parse).not.toBeCalled();
        });

        it("should call parseExamples if endpoint has no parameters but has examples", async () => {
            parseEndpointSpy.mockReturnValueOnce(parserEmptyResultMock);
            await converterWithExamplesParser.convert([requestWithExamples]);
            expect(examplesParser.parse).toBeCalled();
        });

        it("should create warning message if there were no parameters nor examples", async () => {
            parseEndpointSpy.mockReturnValueOnce(parserEmptyResultMock);
            const results = await converterWithExamplesParser.convert([emptyRequest]);
            expect(results[0].warning).toContain(ConverterMessages.INVALID_PARAMETERS_AND_EXAMPLES);
        });

        it("should combine interfaces got from fields and from examples", async () => {
            createInterfaceSpy.mockReturnValueOnce(Promise.resolve("mock fields interface"));
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
});
