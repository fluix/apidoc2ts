import * as _ from "lodash";
import {escapeRegExp} from "tslint/lib/utils";

interface InterfaceInfo {
    name: string;
    body: string;
    string: string;
}

export class DuplicatesRemover {
    static regex = /export (?:interface|enum) (\w+) {([^}]+)}/gm;

    removeDuplicates(interfaces: string) {
        const resultInterfaces = interfaces;
        const interfacesArray = this.getInterfacesArray(interfaces);
        const duplicates = _.values(this.findDuplicates(interfacesArray));

        const removedDuplicates = this.replaceDuplicates(duplicates, resultInterfaces);
        const result = this.concatDuplicates(duplicates, removedDuplicates);
        return result.replace(/\n{2,}/g, "\n");
    }

    private concatDuplicates(duplicates, interfaces) {
        return `${interfaces}${duplicates.join("\n")}`;
    }

    private replaceDuplicates(duplicates, interfaces) {
        let newInterfaces = interfaces;
        duplicates.forEach(duplicate => {
            const regexPattern = escapeRegExp(duplicate);
            const regexp = new RegExp(`(${regexPattern})`, "g");
            newInterfaces = newInterfaces.replace(regexp, "");
        });
        return newInterfaces;
    }

    private findDuplicates(interfaces: Array<string>): Array<InterfaceInfo> {
        const duplicates: Array<InterfaceInfo> = [];

        for (let i = 0; i < interfaces.length; i += 1) {
            const currentInterface = interfaces[i];
            const {
                name: currentInterfaceName,
                body: currentInterfaceBody,
            } = this.getInterfaceInfo(currentInterface);

            for (let j = 0; j < interfaces.length; j += 1) {
                if (i === j) {
                    continue;
                }

                const otherInterface = interfaces[j];
                const {
                    name: otherInterfaceName,
                    body: otherInterfaceBody,
                } = this.getInterfaceInfo(otherInterface);

                if (currentInterfaceName === otherInterfaceName) {
                    duplicates[currentInterfaceName] = currentInterface;
                }
            }
        }

        return duplicates;
    }

    private getInterfacesArray(interfaces: string): Array<string> {
        return interfaces.match(DuplicatesRemover.regex) || [];
    }

    private getInterfaceInfo(otherInterface: string): InterfaceInfo {
        const regex = new RegExp(DuplicatesRemover.regex);
        const matches = regex.exec(otherInterface);
        if (!matches) {
            return {
                name: "",
                body: "",
                string: otherInterface,
            };
        }

        return {
            name: matches[1],
            body: matches[2],
            string: otherInterface,
        };
    }
}
