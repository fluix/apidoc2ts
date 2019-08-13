import React from "react";
import Feature from "./components/feature/feature";
import Header from "./components/header/header";
import QuickStart from "./components/quick-links/quick-start";
import Title from "./components/title/title";
import {features} from "./features";
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
                installCommand="npm install apidoc2ts -g"
                githubLink="https://github.com/fluix/web-apidoc2ts"
                npmLink="https://www.npmjs.com/package/apidoc2ts"
            />
            {features.map((feature, index) => (
                <Feature image={feature.image}
                         description={feature.description}
                         imageOnLeft={feature.imageOnLeft}
                         key={index}
                />
            ))}
        </>
    );
};

export default App;
