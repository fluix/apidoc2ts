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
    "rules": {
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/indent": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-param-reassign": "error",
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/prefer-interface": "error",
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
                    "log",
                    "debug",
                    "info",
                    "time",
                    "timeEnd",
                    "trace"
                ]
            }
        ],
        "no-debugger": "error",
        "no-empty": "off",
        "no-empty-functions": "off",
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
                    "max-line-length": [
                        true,
                        120
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
                    "quotemark": [
                        true,
                        "double",
                        "avoid-escape",
                        "avoid-template",
                        "jsx-double"
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
