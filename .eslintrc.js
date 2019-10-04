module.exports = {
    "extends": ["airbnb"],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "globals": {
        "jest": "readonly",
        "it": "readonly",
        "expect": "readonly",
        "describe": "readonly",
        "beforeEach": "readonly",
        "afterEach": "readonly",
        "beforeAll": "readonly",
        "afterAll": "readonly",
    },
    "rules": {
        // eslint typescript support fixes/problems
        "import/no-unresolved": "off",

        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",

        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "error",

        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "error",

        // "@typescript-eslint/prefer-interface": "error",
        // "@typescript-eslint/no-param-reassign": "error",

        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/indent": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-this-alias": "off",

        "max-len": ["error", 120, 4],
        "object-curly-spacing": ["error", "never"],
        "class-methods-use-this": "off",
        "quotes": ["error", "double",
            {
                avoidEscape: true
            }
        ],
        "indent": ["error", 4, {
            "SwitchCase": 1,
            "VariableDeclarator": 1,
            "outerIIFEBody": 1,
            "FunctionDeclaration": {
                "parameters": 1,
                "body": 1
            },
            "FunctionExpression": {
                "parameters": 1,
                "body": 1
            },
            "CallExpression": {
                "arguments": 1
            },
            "ArrayExpression": 1,
            "ObjectExpression": 1,
            "ImportDeclaration": 1,
            "flatTernaryExpressions": false,
            "ignoredNodes": [
                "JSXElement",
                "JSXElement > *",
                "JSXAttribute",
                "JSXIdentifier",
                "JSXNamespacedName",
                "JSXMemberExpression",
                "JSXSpreadAttribute",
                "JSXExpressionContainer",
                "JSXOpeningElement",
                "JSXClosingElement",
                "JSXText",
                "JSXEmptyExpression",
                "JSXSpreadChild"
            ],
            "ignoreComments": false
        }],
        "lines-between-class-members": ["error", "always",
            {
                exceptAfterSingleLine: true
            }
        ],
        "no-continue": "off",
        'no-underscore-dangle': ['error', {
            allow: [],
            allowAfterThis: true,
            allowAfterSuper: false,
            enforceInMethodNames: true,
        }],
        "arrow-parens": [
            "off",
            "as-needed"
        ],
        "curly": "error",
        "dot-notation": "error",
        "eol-last": "error",
        "guard-for-in": "error",
        "new-parens": "error",
        "no-bitwise": "off",
        "no-caller": "error",
        "no-console": [
            "error",
            {
                "allow": [
                    "warn",
                    "error"
                ]
            }
        ],
        "no-debugger": "error",
        "no-empty": "off",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-multiple-empty-lines": "error",
        "no-new-wrappers": "error",
        "no-unused-labels": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "prefer-const": "error",
        "prefer-template": "error",
        "quote-props": [
            "error",
            "as-needed"
        ],
        "radix": "error",
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "named": "never"
            }
        ],
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rulesDirectory": [
                    "/Users/user/dev/web-apidoc2ts/node_modules/tslint-consistent-codestyle/rules",
                    "/Users/user/dev/web-apidoc2ts/node_modules/tslint-eslint-rules/dist/rules",
                    "/Users/user/dev/web-apidoc2ts/node_modules/tslint-microsoft-contrib",
                    "/Users/user/dev/web-apidoc2ts/ts-rules"
                ],
                "rules": {
                    "align": [
                        true,
                        "parameters",
                        "statements",
                        "members",
                        "elements"
                    ],
                    "array-bracket-spacing": [
                        true,
                        "never"
                    ],
                    "block-spacing": true,
                    "brace-style": [
                        true,
                        "1tbs",
                        {
                            "allowSingleLine": true
                        }
                    ],
                    "comment-format": [
                        true,
                        "check-space"
                    ],
                    "function-name": [
                        true,
                        {
                            "function-regex": "^[A-Za-z$][\\w\\d]+$",
                            "method-regex": "^[a-z$][\\w\\d]+$",
                            "private-method-regex": "^[a-z$][\\w\\d]+$",
                            "protected-method-regex": "^[a-z$][\\w\\d]+$",
                            "static-method-regex": "^[a-z$][\\w\\d]+$"
                        }
                    ],
                    "no-boolean-literal-compare": true,
                    "no-duplicate-variable": true,
                    "no-else-after-return": true,
                    "no-function-constructor-with-string-args": true,
                    "no-increment-decrement": true,
                    "no-shadowed-variable": true,
                    "no-trailing-whitespace": [
                        true,
                        "ignore-template-strings",
                        "ignore-comments",
                        "ignore-blank-lines"
                    ],
                    "no-underscore-property": true,
                    "no-unused-expression": true,
                    "object-shorthand-properties-first": true,
                    "one-line": [
                        true,
                        "check-open-brace",
                        "check-catch",
                        "check-else",
                        "check-whitespace"
                    ],
                    "semicolon": [
                        true,
                        "always",
                        "strict-bound-class-methods"
                    ],
                    "space-in-parens": [
                        true,
                        "never"
                    ],
                    "spec-defocus": true,
                    "ter-computed-property-spacing": true,
                    "ter-func-call-spacing": true,
                    "ter-indent": [
                        true,
                        4,
                        {
                            "SwitchCase": 1
                        }
                    ],
                    "trailing-comma": [
                        true,
                        {
                            "multiline": "always",
                            "singleline": "never"
                        }
                    ],
                    "triple-equals": [
                        true,
                        "allow-null-check"
                    ],
                    "void-zero": true,
                    "whitespace": [
                        true,
                        "check-branch",
                        "check-decl",
                        "check-operator",
                        "check-separator",
                        "check-type"
                    ]
                }
            }
        ]
    }
};
