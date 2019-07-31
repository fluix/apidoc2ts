import {ConverterResult} from "./ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceGroupingMode, ApiDoc2InterfaceParameters} from "./ApiDoc2Interface";
import {filterEmptyStrings} from "./string-utils";
import {UrlStructureInterfacesWriter} from "./UrlStructureInterfacesWriter";
import {SingleFileInterfacesWriter} from "./SingleFileInterfacesWriter";

export interface InterfacesWriter {
    writeInterfaces(
        interfacesData: Array<ConverterResult>,
        args: ApiDoc2InterfaceParameters,
    ): Promise<void | Array<void>>;
}

export const getInterfaceWriter = (groupingMode: ApiDoc2InterfaceGroupingMode): InterfacesWriter => {
    if (groupingMode === ApiDoc2InterfaceGroupingMode.URL) {
        return new UrlStructureInterfacesWriter();
    }

    return new SingleFileInterfacesWriter();
};

export const stringifyAllInterfaces = (converterResults: Array<ConverterResult>): string => {
    return converterResults
        .map((endpointData) => this.stringifyInterfaces(endpointData))
        .filter(filterEmptyStrings)
        .join("\n");
};

export const stringifyInterfaces = (converterResult: ConverterResult): string => {
    return [
        converterResult.requestInterface,
        converterResult.responseInterface,
        converterResult.errorInterface,
    ].filter(filterEmptyStrings).join("\n");
};
