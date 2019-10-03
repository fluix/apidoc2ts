import * as path from "path";
import { ApiDoc2InterfaceParameters } from "../ApiDoc2Interface";
import { ConverterResult } from "../endpoint-converter/ApiDocToInterfaceConverter";
import { writeFileToPath } from "../utils/FsUtils";
import { stringifyAllInterfaces } from "../utils/WriterUtils";
import { InterfacesWriter } from "./InterfacesWriter";

export class SingleFileInterfacesWriter implements InterfacesWriter {
    writeInterfaces(interfacesData: Array<ConverterResult>, args: ApiDoc2InterfaceParameters): Promise<void> {
        const interfacesString = stringifyAllInterfaces(interfacesData);
        const filePath = path.join(args.output, args.name);

        return writeFileToPath(filePath, interfacesString);
    }
}
