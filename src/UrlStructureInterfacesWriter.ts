import {InterfacesWriter, stringifyInterfaces} from "./InterfacesWriter";
import {ConverterResult} from "./ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceParameters} from "./ApiDoc2Interface";
import {getUrlWithoutParameters} from "./string-utils";
import {promisify} from "util";
import * as path from "path";
import * as fs from "fs";

const writeFile = promisify(fs.writeFile);

export class UrlStructureInterfacesWriter implements InterfacesWriter {
    writeInterfaces(interfacesData: Array<ConverterResult>, args: ApiDoc2InterfaceParameters): Promise<void[]> {
        return Promise.all(interfacesData.map(converterResult => {
            const interfacesString = stringifyInterfaces(converterResult);

            if (interfacesString.length === 0) {
                return;
            }

            return this.writeInterfaceIntoUrlPath(converterResult, args, interfacesString);
        }));
    }

    private writeInterfaceIntoUrlPath(converterResult, args: ApiDoc2InterfaceParameters, interfacesString) {
        const urlPath = getUrlWithoutParameters(converterResult.metadata.url);
        const filePath = path.join(args.output, urlPath, `${converterResult.metadata.name}.ts`);

        return this.writeFile(filePath, interfacesString);
    }

    private writeFile(filePath, interfacesString) {
        fs.mkdirSync(path.dirname(filePath), {recursive: true});
        return writeFile(filePath, interfacesString);
    }
}
