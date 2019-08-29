import * as path from "path";
import {ApiDoc2InterfaceParameters} from "../ApiDoc2Interface";
import {ConverterResult} from "../endpoint-converter/ApiDocToInterfaceConverter";
import {writeFileToPath} from "../FsUtils";
import {getUrlWithoutParameters} from "../StringUtils";
import {InterfacesWriter} from "./InterfacesWriter";
import {stringifyInterfaces} from "./WriterUtils";

export class UrlStructureInterfacesWriter implements InterfacesWriter {
    async writeInterfaces(interfacesData: Array<ConverterResult>, args: ApiDoc2InterfaceParameters): Promise<void> {
        await Promise
            .all(interfacesData.map(converterResult => {
                const interfacesString = stringifyInterfaces(converterResult);

                if (interfacesString.length === 0) {
                    return;
                }

                return this.writeInterfaceIntoUrlPath(converterResult, args, interfacesString);
            }))
            .then(() => {
                return Promise.resolve();
            });
    }

    private writeInterfaceIntoUrlPath(converterResult, args: ApiDoc2InterfaceParameters, interfacesString) {
        const urlPath = getUrlWithoutParameters(converterResult.metadata.url);
        const filePath = path.join(args.output, urlPath, `${converterResult.metadata.name}.ts`);

        return writeFileToPath(filePath, interfacesString);
    }
}
