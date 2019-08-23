import {IApiDocEndpointPart} from "../ApiDocInterfaces";
import {ApiDocExamplesParser} from "./ApiDocExamplesParser";

const emptyEndpointPart: IApiDocEndpointPart = {};

const exampleJsonString = ' { "name": "username", "age": 12 }';

const simpleEndpointPart: IApiDocEndpointPart = {
    examples: [
        {
            title: "title",
            type: "json",
            content: exampleJsonString,
        },
    ],
};

const endpointPartWithInvalidExamples: IApiDocEndpointPart = {
    examples: [
        {
            title: "title",
            type: "json",
            content: "{invalid{example}",
        },
    ],
};

describe("ApiDocExamplesParser", () => {
    const examplesParser = new ApiDocExamplesParser();

    it("should return empty string if there are no examples", async () => {
        const interfaceString = await examplesParser.parse(emptyEndpointPart);
        expect(interfaceString).toBe("");
    });

    it("should return empty string if example is not valid", async () => {
        const interfaceString = await examplesParser.parse(endpointPartWithInvalidExamples);
        expect(interfaceString).toBe("");
    });

    it("should create interface with passed name", async () => {
        const interfaceString = await examplesParser.parse(simpleEndpointPart, "User");
        expect(interfaceString).toContain("interface User");
    });

    it("should create fields for simple example", async () => {
        const interfaceString = await examplesParser.parse(simpleEndpointPart);
        expect(interfaceString).toContain("name: string;");
        expect(interfaceString).toContain("age: number;");
    });
});
