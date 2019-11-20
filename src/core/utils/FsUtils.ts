/* eslint-disable import/no-duplicates */
import * as fs from "fs";
import {WriteFileOptions} from "fs";
import * as makeDir from "make-dir";
import * as path from "path";
import {promisify} from "util";

const writeFile = promisify(fs.writeFile);

export function writeFileToPath(filePath: string, data: any, options?: WriteFileOptions): Promise<void> {
    return makeDir(path.dirname(filePath), {})
        .then(() => writeFile(filePath, data, options));
}
