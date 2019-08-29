import {ApiDoc2Interface} from "./ApiDoc2Interface";
import {ApiDoc2InterfaceBuilder, BuilderOptions} from "./ApiDoc2InterfaceBuilder";
import {
    ApiDocToInterfaceConverter,
    converterDefaultOptions,
    ConverterVersionResolving,
} from "./converter/ApiDocToInterfaceConverter";
import {ApiDocEndpointParser} from "./endpoint-parser/ApiDocEndpointParser";
import {ApiDocExamplesParser} from "./endpoint-parser/ApiDocExamplesParser";
import {InterfaceGenerator} from "./interface-generator/InterfaceGenerator";

jest.mock("./interface-generator/InterfaceGenerator");
jest.mock("./endpoint-parser/ApiDocEndpointParser");
jest.mock("./endpoint-parser/ApiDocExamplesParser");
jest.mock("./converter/ApiDocToInterfaceConverter");
jest.mock("./ApiDoc2Interface");

describe("ApiDoc2InterfaceBuilder", () => {
    const builder = new ApiDoc2InterfaceBuilder();
    const parameters: Partial<BuilderOptions> = {
        customTypes: ["File", "URL"],
        versionResolving: ConverterVersionResolving.LAST,
        requestPrefix: "RequestPrefix",
        requestPostfix: "RequestPostfix",
        responsePrefix: "ResponsePrefix",
        responsePostfix: "ResponsePostfix",
        errorPrefix: "ErrorPrefix",
        errorPostfix: "ErrorPostfix",
    };

    it("should create parser during execution", () => {
        builder.build(parameters);
        expect(ApiDocEndpointParser).toBeCalled();
    });

    it("should create generator with passed custom types", () => {
        builder.build(parameters);
        expect(InterfaceGenerator).toBeCalledWith(parameters.customTypes);
    });

    it("should create generator with empty array if no custom types specified", () => {
        builder.build({});
        expect(InterfaceGenerator).toBeCalledWith([]);
    });

    it("should create converter with previously created parser/generator", () => {
        builder.build(parameters);
        expect(ApiDocToInterfaceConverter).toBeCalledWith(
            (InterfaceGenerator as jest.Mock).mock.instances[0],
            (ApiDocEndpointParser as unknown as jest.Mock).mock.instances[0],
            expect.anything(),
            expect.anything(),
        );
    });

    it("should create converter with passed in parameters", () => {
        builder.build(parameters);
        expect(ApiDocToInterfaceConverter).toBeCalledWith(
            expect.anything(),
            expect.anything(),
            parameters,
            expect.anything(),
        );
    });

    it("should create converter with default values if no parameters are specified", () => {
        builder.build({});
        expect(ApiDocToInterfaceConverter).toBeCalledWith(
            expect.anything(),
            expect.anything(),
            converterDefaultOptions,
            expect.anything(),
        );
    });

    it("should create converter with default examples parser", () => {
        builder.build(parameters);
        expect(ApiDocToInterfaceConverter).toBeCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            (ApiDocExamplesParser as jest.Mock).mock.instances[0],
        );
    });

    it("should create apiDoc2Interface wrapper with created converter", () => {
        builder.build(parameters);
        expect(ApiDoc2Interface).toBeCalledWith(
            (ApiDocToInterfaceConverter as jest.Mock).mock.instances[0],
        );
    });
});
