import {InterfacesWriter, stringifyAllInterfaces} from "./InterfacesWriter";
import {ConverterResult} from "./ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceParameters} from "./ApiDoc2Interface";
import {writeFileToPath} from "./fs-utils";
import * as path from "path";

export class SingleFileInterfacesWriter implements InterfacesWriter {
    writeInterfaces(interfacesData: Array<ConverterResult>, args: ApiDoc2InterfaceParameters): Promise<void> {
        const interfacesString = stringifyAllInterfaces(interfacesData);
        const filePath = path.join(args.output, args.name);

        return writeFileToPath(filePath, interfacesString);
    }
}
