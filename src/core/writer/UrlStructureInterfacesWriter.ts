import {InterfacesWriter} from "./InterfacesWriter";
import {ConverterResult} from "../converter/ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceParameters} from "../ApiDoc2Interface";
import {getUrlWithoutParameters} from "../StringUtils";
import {writeFileToPath} from "../FsUtils";
import {stringifyInterfaces} from "./WriterUtils";
import * as path from "path";

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
