export const filterEmptyStrings = (str) => {
    return str !== "";
};

export function removeFieldsAligningSpaces(interfaceString): string {
    return interfaceString.replace(/:\s+/, ": ");
}
