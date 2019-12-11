import {ConverterResult} from "../endpoint-converter/ApiDocToInterfaceConverter";
import {filterEmptyStrings, removeConsecutiveBlankLines} from "./StringUtils";

export function stringifyInterfaces(converterResult: ConverterResult): string {
    const stringifiedInterfaces = [
        converterResult.requestInterface,
        converterResult.responseInterface,
        converterResult.errorInterface,
    ].filter(filterEmptyStrings).join("\n");

    return removeConsecutiveBlankLines(stringifiedInterfaces);
}

export function stringifyAllInterfaces(converterResults: Array<ConverterResult>): string {
    const stringifiedInterfaces = converterResults
        .map((endpointData) => stringifyInterfaces(endpointData))
        .filter(filterEmptyStrings)
        .join("\n");

    return removeConsecutiveBlankLines(stringifiedInterfaces);
}
