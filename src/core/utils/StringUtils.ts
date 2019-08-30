export const filterEmptyStrings = (str: string) => {
    return str !== "";
};

export function removeFieldsAligningSpaces(interfaceString: string): string {
    return interfaceString.replace(/:\s+/g, ": ");
}

export function getUrlWithoutParameters(url: string) {
    const urlWithoutParams = url.match(/^(?:\/\w+)+/);
    if (!urlWithoutParams || urlWithoutParams.length === 0) {
        return "/";
    }
    return urlWithoutParams[0];
}
