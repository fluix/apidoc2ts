import {DuplicatesRemover} from "./DuplicatesRemover";

describe("Duplicates remover", () => {
    const remover = new DuplicatesRemover();

    const userInterface = `export interface User {
    name: string;
    age: number;
}`;
    const addressInterface = `export interface Address {
    street: string;
    building: string;
}`;
    const enum1 = `export enum FSType {
    Flx = "flx",
    PersonalDocs = "personal_docs",
}`;

    it("should not remove anything if there is no duplicates", () => {
        const interfaces = `${userInterface}\n${addressInterface}`;
        expect(remover.removeDuplicates(interfaces)).toBe(interfaces);
    });

    it("should remove two interfaces with the same name", () => {
        const interfaces = `${userInterface}\n${userInterface}`;
        expect(remover.removeDuplicates(interfaces)).toBe(`\n${userInterface}`);
    });

    it("should remove multiple duplicates", () => {
        const interfaces = `${userInterface}\n${userInterface}\n${userInterface}`;
        expect(remover.removeDuplicates(interfaces)).toBe(`\n${userInterface}`);
    });

    it("should remove multiple different duplicates", () => {
        const interfaces = `${userInterface}\n${userInterface}\n${addressInterface}\n${addressInterface}`;
        expect(remover.removeDuplicates(interfaces)).toBe(`\n${userInterface}\n${addressInterface}`);
    });

    it("should remove duplicate enums", () => {
        const enums = `${enum1}\n${enum1}`;
        expect(remover.removeDuplicates(enums)).toBe(`\n${enum1}`);
    });
});
