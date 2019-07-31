import {ConverterResult} from "./ApiDocToInterfaceConverter";
import {ApiDoc2InterfaceParameters} from "./ApiDoc2Interface";
import {filterEmptyStrings} from "./string-utils";

export interface InterfacesWriter {
    writeInterfaces(
        interfacesData: Array<ConverterResult>,
        args: ApiDoc2InterfaceParameters,
    ): Promise<void | void[]>;
}

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
