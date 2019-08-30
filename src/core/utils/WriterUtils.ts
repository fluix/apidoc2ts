import {ConverterResult} from "../endpoint-converter/ApiDocToInterfaceConverter";
import {filterEmptyStrings} from "./StringUtils";

export function stringifyAllInterfaces(converterResults: Array<ConverterResult>): string {
    return converterResults
        .map((endpointData) => stringifyInterfaces(endpointData))
        .filter(filterEmptyStrings)
        .join("\n");
}

export function stringifyInterfaces(converterResult: ConverterResult): string {
    return [
        converterResult.requestInterface,
        converterResult.responseInterface,
        converterResult.errorInterface,
    ].filter(filterEmptyStrings).join("\n");
}
