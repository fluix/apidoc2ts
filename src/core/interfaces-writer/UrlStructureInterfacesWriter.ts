import * as path from "path";
import {ApiDoc2InterfaceParameters} from "../ApiDoc2Interface";
import {ConverterResult} from "../endpoint-converter/ApiDocToInterfaceConverter";
import writeFileToPath from "../utils/FsUtils";
import {getUrlWithoutParameters} from "../utils/StringUtils";
import {stringifyInterfaces} from "../utils/WriterUtils";
import {InterfacesWriter} from "./InterfacesWriter";

export default class UrlStructureInterfacesWriter implements InterfacesWriter {
    async writeInterfaces(interfacesData: Array<ConverterResult>, args: ApiDoc2InterfaceParameters): Promise<void> {
        await Promise
            .all(interfacesData.map(converterResult => {
                const interfacesString = stringifyInterfaces(converterResult);

                if (interfacesString.length === 0) {
                    return Promise.resolve();
                }

                return this.writeInterfaceIntoUrlPath(converterResult, args, interfacesString);
            }))
            .then(() => Promise.resolve());
    }

    private writeInterfaceIntoUrlPath(
        converterResult: ConverterResult,
        args: ApiDoc2InterfaceParameters,
        interfacesString: string,
    ) {
        const urlPath = getUrlWithoutParameters(converterResult.metadata.url);
        const filePath = path.join(args.output, urlPath, `${converterResult.metadata.name}.ts`);

        return writeFileToPath(filePath, interfacesString);
    }
}
