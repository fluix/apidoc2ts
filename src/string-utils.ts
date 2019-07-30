export const filterEmptyStrings = (str) => {
    return str !== "";
};

export function removeFieldsAligningSpaces(interfaceString): string {
    return interfaceString.replace(/:\s+/g, ": ");
}

export function getUrlWithoutParameters(url: string) {
    const found = url.match(/^((?:\/\w+)+)/);
    if (!found || found.length === 0) {
        return "/";
    }
    return found[0];
}
