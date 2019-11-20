#!/usr/bin/env node

const childProcessExec = require('child_process').exec;
const util = require('util');
const branchRegex = new RegExp("(?:impr|fix|feat|ref)\\/[\\w-]+");

const exec = util.promisify(childProcessExec);

async function getCurrentBranch() {
    const branchesOutput = await exec('git branch');

    if (branchesOutput.stderr) {
        throw new Error(stderr);
    }

    return branchesOutput.stdout
        .split('\n')
        .find(b => b.trim().charAt(0) === '*')
        .trim()
        .substring(2);
}

async function checkBranchName() {
    const branchName = await getCurrentBranch();

    if (branchRegex.test(branchName)) {
        process.exit(0);
    }

    console.log("Invalid branch name");
    console.log("Branch name should start with: 'impr', 'fix', 'feat' or 'ref'");
    console.log("Please check contributing guide for more information");
    console.log("https://github.com/fluix/apidoc2ts/blob/develop/CONTRIBUTING.md");
    process.exit(1);
}

checkBranchName()
