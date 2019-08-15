import template_image from "./images/gray-box.png";

export const features = [
    {
        header: "Grouping by URL",
        description: `Group your interfaces into files placed in directories
        according to the URL structure of the endpoint`,
        image: template_image,
        imageOnLeft: true,
    },
    {
        header: "Enumerations",
        description: "Create enumerations from specified allowed values an your documentation",
        image: template_image,
        imageOnLeft: false,
    },
    {
        header: "Customizing",
        description: `Customize interface names by specifying general prefix/postfix or separate
        prefixes/postfixes for request, response and error response`,
        image: template_image,
        imageOnLeft: true,
    },
    {
        header: "Versions",
        description: `Choose which versions should be used to generate interfaces. You can generate
        interfaces for all versions or only the latest ones`,
        image: template_image,
        imageOnLeft: false,
    },
    {
        header: "Nested fields",
        description: "Automatically get separate interfaces for nested fields",
        image: template_image,
        imageOnLeft: true,
    },
];

export const links = {
    github: "https://github.com/fluix/web-apidoc2ts",
    npm: "https://www.npmjs.com/package/apidoc2ts",
};
