import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";
import {WriteFileOptions} from "fs";

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export function writeFileToPath(filePath: string, data: any, options?: WriteFileOptions): Promise<void> {
    return mkdir(path.dirname(filePath), {recursive: true})
        .then(() => {
            return writeFile(filePath, data, options);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}
