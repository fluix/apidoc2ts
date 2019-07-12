"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const bannedFunctions = ["fdescribe", "fit"];
class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING(propName) {
        return `${propName} calls are not allowed`;
    }
    apply(sourceFile) {
        return this.applyWithWalker(new NoFocusTestWalker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
// The walker takes care of all the work.
class NoFocusTestWalker extends Lint.RuleWalker {
    visitCallExpression(node) {
        const functionName = node.expression.getText();
        // create a failure at the current position if call is banned
        if (bannedFunctions.indexOf(functionName) !== -1) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING(functionName)));
        }
        // call the base version of this visitor to actually parse this node
        super.visitCallExpression(node);
    }
}
