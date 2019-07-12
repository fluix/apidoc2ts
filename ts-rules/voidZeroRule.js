"use strict";
/*
    copied from https://github.com/Microsoft/tslint-microsoft-contrib/pull/770
    Should be removed when tslint-microsoft-contrib@6.0.0 will be merged into tslint-config-airbnb
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const tsutils = require("tsutils");
const ts = require("typescript");
const FAILURE_STRING = "Replace void 0 with undefined";
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    }
}
exports.Rule = Rule;
function walk(ctx) {
    function cb(node) {
        if (tsutils.isVoidExpression(node)) {
            if (node.expression !== undefined && node.expression.getText() === "0") {
                const nodeStart = node.getStart();
                const nodeWidth = node.getWidth();
                const fix = new Lint.Replacement(nodeStart, nodeWidth, "undefined");
                ctx.addFailureAt(nodeStart, nodeWidth, FAILURE_STRING, fix);
            }
        }
        return ts.forEachChild(node, cb);
    }
    return ts.forEachChild(ctx.sourceFile, cb);
}
