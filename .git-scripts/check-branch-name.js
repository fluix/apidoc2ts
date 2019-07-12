#!/usr/bin/env node

const childProcessExec = require('child_process').exec;
const util = require('util');
const branchRegex = new RegExp("EWN-\\d+\\/[\\w-]+");

const exec = util.promisify(childProcessExec);

async function getCurrentBranch() {

    const branchesOutput = await exec('git branch');
    if (branchesOutput.stderr) {
        throw new Error(stderr);
    }
    let branch = branchesOutput.stdout;
    branch = branch.split('\n').find(b => b.trim().charAt(0) === '*').trim().substring(2);
    return branch;
}

async function checkBranchName() {
    let branchName = await getCurrentBranch();
    if (!branchRegex.test(branchName)) {
        console.log("Invalid branch name");
        console.log("Use EWN-######/my-description-message");
        process.exit(1);
    }
}

checkBranchName()
