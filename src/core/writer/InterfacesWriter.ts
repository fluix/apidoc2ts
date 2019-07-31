import {ConverterResult} from "../converter/ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceGroupingMode, ApiDoc2InterfaceParameters} from "../ApiDoc2Interface";
import {UrlStructureInterfacesWriter} from "./UrlStructureInterfacesWriter";
import {SingleFileInterfacesWriter} from "./SingleFileInterfacesWriter";

export interface InterfacesWriter {
    writeInterfaces(
        interfacesData: Array<ConverterResult>,
        args: ApiDoc2InterfaceParameters,
    ): Promise<void | Array<void>>;
}

export function getInterfaceWriter(groupingMode: ApiDoc2InterfaceGroupingMode): InterfacesWriter {
    if (groupingMode === ApiDoc2InterfaceGroupingMode.URL) {
        return new UrlStructureInterfacesWriter();
    }

    return new SingleFileInterfacesWriter();
}
