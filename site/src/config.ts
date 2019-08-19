import {TerminalLine} from "./components/terminal/terminal";
import featureCustomizing from "./images/feature_customizing.png";
import featureEnums from "./images/feature_enums.png";
import featureNestedFields from "./images/feature_nested.png";
import featureUrlGrouping from "./images/feature_url.png";
import featureVersions from "./images/feature_versions.png";

export const features = [
    {
        header: "Grouping by URL",
        description: `Group your interfaces into files placed in directories
        according to the URL structure of the endpoint`,
        image: featureUrlGrouping,
        imageOnLeft: false,
    },
    {
        header: "Enumerations",
        description: "Create enumerations from specified allowed values an your documentation",
        image: featureEnums,
        imageOnLeft: true,
    },
    {
        header: "Customizing",
        description: `Customize interface names by specifying general prefix/postfix or separate
        prefixes/postfixes for request, response and error response`,
        image: featureCustomizing,
        imageOnLeft: false,
    },
    {
        header: "Versions",
        description: `Choose which versions should be used to generate interfaces. You can generate
        interfaces for all versions or only the latest ones`,
        image: featureVersions,
        imageOnLeft: true,
    },
    {
        header: "Nested fields",
        description: "Automatically get separate interfaces for nested fields",
        image: featureNestedFields,
        imageOnLeft: false,
    },
];

export const links = {
    github: "https://github.com/fluix/web-apidoc2ts",
    npm: "https://www.npmjs.com/package/apidoc2ts",
};

export const terminalLines: Array<TerminalLine> = [
    {
        type: "command",
        text: "npm i -g apidoc2ts",
    },
    {
        type: "response",
        text: "Installed apidoc2ts",
    },
    {
        type: "command",
        text: "apidoc2ts --source ./doc/api_data.json --output ./out --name interfaces.ts",
    },
    {
        type: "response",
        text: "Successfully generated interfaces",
    },
    {
        type: "command",
        text: "cat ./out/interfaces.ts",
    },
    {
        type: "response",
        text: `export interface User {
    name: string;
    age: number;
}`,
    },
];
