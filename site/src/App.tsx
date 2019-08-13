import React from "react";
import Feature from "./components/feature/feature";
import Header from "./components/header/header";
import LinkButton from "./components/link-button/link-button";
import QuickStart from "./components/quick-links/quick-start";
import Terminal from "./components/terminal/terminal";
import Title from "./components/title/title";
import template_image from "./images/gray-box.png";

const App: React.FC = () => {
    return (
        <>
            <Header>ApiDoc2ts</Header>
            <Title
                text="Get rid of boring day-to-day manual retyping and mechanical mistakes"
                image={template_image}
            />
            <QuickStart
                installCommand="$ npm install apidoc2ts -g"
                githubLink="https://github.com/fluix/web-apidoc2ts"
                npmLink="https://www.npmjs.com/package/apidoc2ts"
            />
            <Feature
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Aenean tincidunt metus ac ligula tempor, eget lobortis velit blandit.
                Ut suscipit augue eget nibh rutrum, non lobortis turpis mattis.
                Cras vel mauris faucibus, hendrerit ex non, vehicula massa.
                Nullam iaculis turpis eget leo mollis finibus."
                image={template_image}
                imageOnLeft={true}
            />
            <Feature
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Aenean tincidunt metus ac ligula tempor, eget lobortis velit blandit.
                Ut suscipit augue eget nibh rutrum, non lobortis turpis mattis.
                Cras vel mauris faucibus, hendrerit ex non, vehicula massa.
                Nullam iaculis turpis eget leo mollis finibus."
                image={template_image}
                imageOnLeft={false}
            />
            <Feature
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Aenean tincidunt metus ac ligula tempor, eget lobortis velit blandit.
                Ut suscipit augue eget nibh rutrum, non lobortis turpis mattis.
                Cras vel mauris faucibus, hendrerit ex non, vehicula massa.
                Nullam iaculis turpis eget leo mollis finibus."
                image={template_image}
                imageOnLeft={true}
            />
            <Terminal lines={["code line 1", "code line 2", "code line 3"]} />
            <LinkButton text="GitHub" link="https://github.com/fluix/web-apidoc2ts" />
        </>
    );
};

export default App;
