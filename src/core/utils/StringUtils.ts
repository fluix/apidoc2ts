export const filterEmptyStrings = (str: string) => str.trim() !== "";

export function removeFieldsAligningSpaces(interfaceString: string): string {
    return interfaceString.replace(/:\s+/g, ": ");
}

export function removeConsecutiveBlankLines(string: string): string {
    return string
        .replace(/\n([\n])+\n/gm, "\n\n")
        .replace(/\n\n$/, "\n");
}

export function getUrlWithoutParameters(url: string) {
    const urlWithoutParams = url.match(/^(?:\/\w+)+/);
    if (!urlWithoutParams || urlWithoutParams.length === 0) {
        return "/";
    }
    return urlWithoutParams[0];
}
