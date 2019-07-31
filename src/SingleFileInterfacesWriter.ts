import {InterfacesWriter, stringifyAllInterfaces} from "./InterfacesWriter";
import {ConverterResult} from "./ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceParameters} from "./ApiDoc2Interface";
import {promisify} from "util";
import * as path from "path";
import * as fs from "fs";

const writeFile = promisify(fs.writeFile);

export class SingleFileInterfacesWriter implements InterfacesWriter {
    writeInterfaces(interfacesData: Array<ConverterResult>, args: ApiDoc2InterfaceParameters): Promise<void> {
        const interfacesString = stringifyAllInterfaces(interfacesData);
        const filePath = path.join(args.output, args.name);

        return this.writeFile(filePath, interfacesString);
    }

    private writeFile(filePath, interfacesString) {
        fs.mkdirSync(path.dirname(filePath), {recursive: true});
        return writeFile(filePath, interfacesString);
    }
}
