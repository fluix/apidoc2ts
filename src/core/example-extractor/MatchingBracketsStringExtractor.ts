export default class MatchingBracketsStringExtractor {
    private openBrackets = ["{", "["];
    private closeBrackets = ["}", "]"];
    private matchingBrackets: { [bracket: string]: string } = {
        "{": "}",
        "[": "]",
    };

    getString(bracketsString: string) {
        let substringStart = 0;
        let substringEnd = 0;
        const bracketsStack: Array<string> = [];

        for (let i = 0; i < bracketsString.length; i += 1) {
            const char = bracketsString[i];

            if (this.isOpenBracket(char)) {
                if (bracketsStack.length === 0) {
                    substringStart = i;
                }
                bracketsStack.push(char);
                continue;
            }

            if (this.isCloseBracket(char)) {
                const bracket = bracketsStack.pop();
                if (bracketsStack.length === 0) {
                    substringEnd = i + 1;
                    break;
                }
                if (bracket && !this.isMatchingBracket(bracket, char)) {
                    throw new Error("Close bracket does not match the open bracket");
                }
            }
        }

        if (bracketsStack.length !== 0) {
            throw new Error("String brackets are not balanced");
        }

        return bracketsString.substring(substringStart, substringEnd);
    }

    private isMatchingBracket(bracket: string, char: string): boolean {
        return char === this.matchingBrackets[bracket];
    }

    private isCloseBracket(char: string): boolean {
        return this.closeBrackets.includes(char);
    }

    private isOpenBracket(char: string): boolean {
        return this.openBrackets.includes(char);
    }
}
