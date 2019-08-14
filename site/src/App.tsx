import React from "react";
import Feature from "./components/feature/feature";
import Header from "./components/header/header";
import LinkButton from "./components/link-button/link-button";
import QuickStart from "./components/quick-links/quick-start";
import Terminal from "./components/terminal/terminal";
import Title from "./components/title/title";
import {features, links} from "./config";
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
                githubLink={links.github}
                npmLink={links.npm}
            />
            {features.map((feature, index) => (
                <Feature image={feature.image}
                         description={feature.description}
                         imageOnLeft={feature.imageOnLeft}
                         key={index}
                />
            ))}
            <Terminal lines={["code line 1", "code line 2", "code line 3"]} />
            <LinkButton
                text="GitHub"
                image={template_image}
                link={links.github}
            />
            <LinkButton
                text="npm"
                image={template_image}
                link={links.npm}
            />
        </>
    );
};

export default App;
