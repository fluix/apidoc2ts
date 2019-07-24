import {ApiDocToInterfaceConverter} from "./ApiDocToInterfaceConverter";
import {InterfaceGenerator} from "./InterfaceGenerator";
import {ApiDocEndpointParser} from "./ApiDocEndpointParser";

const getRequestData = {
    type: "get",
    url: "/user/:id",
    title: "Read data of a User",
    version: "0.3.0",
    name: "GetUser",
    group: "User",
    permission: {
        name: "admin",
        title: "Admin access rights needed. ",
        description: "Permission description",
    },
    description: "<p>Interface description</p>",
    parameter: {
        fields: {
            Parameter: [
                {
                    group: "Parameter",
                    type: "string",
                    field: "id",
                    optional: false,
                    description: "<p>The Users-ID.</p>",
                },
            ],
        },
    },
    filename: "source/example_full/example.js",
};

const postRequestData = {
    type: "post",
    url: "/user",
    title: "Create a new User",
    version: "0.3.0",
    name: "PostUser",
    group: "User",
    permission: "none",
    description: "<p>Interface description</p>",
    parameter: {
        fields: {
            Parameter: [
                {
                    group: "Parameter",
                    type: "string",
                    field: "name",
                    optional: false,
                    description: "<p>Name of the User.</p>",
                },
            ],
        },
    },
    filename: "source/example_full/example.js",
};

const postRequestDataWithCustomTypes = {
    type: "post",
    url: "/user",
    title: "Create a new User",
    version: "0.3.0",
    name: "CreateUser",
    group: "User",
    permission: "none",
    description: "<p>Interface description</p>",
    parameter: {
        fields: {
            Parameter: [
                {
                    group: "Parameter",
                    type: "User",
                    field: "user",
                    optional: false,
                    description: "<p>User</p>",
                },
            ],
        },
    },
    filename: "source/example_full/example.js",
};

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

jest.mock("./ApiDocEndpointParser");
jest.mock("./InterfaceGenerator");

const apiDocDataFull = [getRequestData, postRequestData, postRequestDataWithCustomTypes];

const parserResultMock = {
    request: {type: "requestMock"},
    response: {type: "responseMock"},
    error: {type: "errorMock"},
};

describe("ApiDoc to Interface converter", () => {
    const apiDocEndpoint: ApiDocEndpointParser = new ApiDocEndpointParser();
    const parseEndpointSpy = jest.spyOn(apiDocEndpoint, "parseEndpoint");

    let interfaceGenerator: InterfaceGenerator;
    let converter: ApiDocToInterfaceConverter;

    beforeEach(() => {
        parseEndpointSpy.mockReset();
        parseEndpointSpy.mockImplementation(() => parserResultMock);

        interfaceGenerator = new InterfaceGenerator(["User"]);
        converter = new ApiDocToInterfaceConverter(interfaceGenerator, apiDocEndpoint);
    });

    it("should return empty array for empty data", async () => {
        expect(await converter.convert([])).toEqual([]);
    });

    it("should call parseEndpoint with apiDoc data", async () => {
        await converter.convert([getRequestData]);
        expect(parseEndpointSpy).toBeCalledWith(getRequestData);
    });

    it("should call createInterface with parsed schemas for request, response and error", async () => {
        await converter.convert([getRequestData]);
        expect(interfaceGenerator.createInterface).toBeCalledWith(parserResultMock.request, expect.anything());
        expect(interfaceGenerator.createInterface).toBeCalledWith(parserResultMock.response, expect.anything());
        expect(interfaceGenerator.createInterface).toBeCalledWith(parserResultMock.error, expect.anything());
    });

    it("should call createInterface with name from apiDoc endpoint and default postfixes", async () => {
        await converter.convert([getRequestData]);
        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(), getRequestData.name);
        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(), `${getRequestData.name}Response`);
        expect(interfaceGenerator.createInterface).toBeCalledWith(expect.anything(), `${getRequestData.name}Error`);
    });

    it("should call parseEndpoint and createInterface for every endpoint", async () => {
        await converter.convert(apiDocDataFull);
        expect(parseEndpointSpy).toBeCalledTimes(apiDocDataFull.length);
        expect(interfaceGenerator.createInterface).toBeCalledTimes(apiDocDataFull.length * 3);
    });

    it("should add version postfix to interface if it is not the newest one", async () => {
        await converter.convert([requestVersion1, requestVersion2, requestVersion3]);
        expect(interfaceGenerator.createInterface)
            .toBeCalledWith(expect.anything(), `${requestVersion1.name}v${requestVersion1.version}`);
        expect(interfaceGenerator.createInterface)
            .toBeCalledWith(expect.anything(), `${requestVersion2.name}v${requestVersion2.version}`);
        expect(interfaceGenerator.createInterface)
            .toBeCalledWith(expect.anything(), `${requestVersion3.name}`);
    });
});
