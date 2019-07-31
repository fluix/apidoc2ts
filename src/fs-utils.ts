import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export function writeFileToPath(filePath, interfacesString): Promise<void> {
    return mkdir(path.dirname(filePath), {recursive: true})
        .then(() => {
            return writeFile(filePath, interfacesString);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}
