import {ApiDocToInterfaceConverter} from "./ApiDocToInterfaceConverter";

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
    name: "PostUser",
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

const apiDocDataWithCustomTypes = [postRequestDataWithCustomTypes];
const apiDocData = [getRequestData, postRequestData];

describe("ApiDoc to Interface converter", () => {
    let converter: ApiDocToInterfaceConverter;

    beforeEach(() => {
        converter = new ApiDocToInterfaceConverter();
    });

    it("should generate array that contains interface strings and metadata", async () => {
        const result = await converter.convert(apiDocData);
        expect(result).toBeInstanceOf(Array);
        expect(result[0].metadata).toBeDefined();
        expect(result[0].interface).toBeDefined();
    });

    it("should generate name for interface based on name from metadata", async () => {
        const result = await converter.convert(apiDocData);
        expect(result[0].interface.includes("interface GetUser {")).toBeTruthy();
        expect(result[1].interface.includes("interface PostUser {")).toBeTruthy();
    });

    it("should generate properties with custom types", async () => {
        const converterWithCustomTypes = new ApiDocToInterfaceConverter(["User"]);
        const result = await converterWithCustomTypes.convert(apiDocDataWithCustomTypes);
        expect(result[0].interface.includes("user: User")).toBeTruthy();
    });
});
