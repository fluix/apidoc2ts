import {ApiDoc2InterfaceGroupingMode, ApiDoc2InterfaceParameters} from "../ApiDoc2Interface";
import {ConverterResult} from "../endpoint-converter/ApiDocToInterfaceConverter";
import SingleFileInterfacesWriter from "./SingleFileInterfacesWriter";
import UrlStructureInterfacesWriter from "./UrlStructureInterfacesWriter";

export default function getInterfaceWriter(groupingMode: ApiDoc2InterfaceGroupingMode): InterfacesWriter {
    if (groupingMode === ApiDoc2InterfaceGroupingMode.URL) {
        return new UrlStructureInterfacesWriter();
    }

    return new SingleFileInterfacesWriter();
}

export interface InterfacesWriter {
    writeInterfaces(
        interfacesData: Array<ConverterResult>,
        args: ApiDoc2InterfaceParameters,
    ): Promise<void>;
}
