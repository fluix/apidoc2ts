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

describe("ApiDocExamplesParser", () => {
    const parser = new ApiDocExamplesParser();

    it("should return empty string if there are no examples", async () => {
        const interfaceString = await parser.parse("name", emptyEndpointPart);
        expect(interfaceString).toBe("");
    });

    it("should create interface with passed name", async () => {
        const interfaceString = await parser.parse("User", simpleEndpointPart);
        expect(interfaceString).toContain("interface User");
    });

    it("should create fields for simple example", async () => {
        const interfaceString = await parser.parse("User", simpleEndpointPart);
        expect(interfaceString).toContain("name: string;");
        expect(interfaceString).toContain("age: number;");
    });
});
