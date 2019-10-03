import { MatchingBracketsStringExtractor } from "./MatchingBracketsStringExtractor";

const complexExample = `{
    [{[{}]}]
    {
        field: value
    }
}`;

describe("Matching brackets parser", () => {
    const stringExtractor = new MatchingBracketsStringExtractor();

    it("should return empty string if no brackets are present in input", () => {
        expect(stringExtractor.getString("")).toBe("");
    });

    it("should return empty string if there is no data between brackets", () => {
        expect(stringExtractor.getString("{}")).toBe("{}");
    });

    it("should throw an error if brackets are not balanced", () => {
        expect(() => stringExtractor.getString("{{}")).toThrow();
    });

    it("should return a curly brackets string", () => {
        expect(stringExtractor.getString("{text}")).toBe("{text}");
    });

    it("should return only a curly brackets string in a string with additional data", () => {
        expect(stringExtractor.getString("noise{text}noise")).toBe("{text}");
    });

    it("should return a square brackets string", () => {
        expect(stringExtractor.getString("some[text]text")).toBe("[text]");
    });

    it("should return first balanced brackets string", () => {
        expect(stringExtractor.getString("a{one}b[two]c")).toBe("{one}");
    });

    it("should return outer brackets string", () => {
        expect(stringExtractor.getString("[one{two}three]")).toBe("[one{two}three]");
    });

    it("should throw an error if bracket types are mixed", () => {
        expect(() => stringExtractor.getString("{one[two}three]")).toThrow();
    });

    it("should parse complex json", () => {
        expect(stringExtractor.getString(complexExample)).toBe(complexExample);
    });
});
