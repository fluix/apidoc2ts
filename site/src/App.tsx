import React from "react";
import Header from "./components/header/header";
import QuickStart from "./components/quick-links/quick-start";
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
                installCommand="npm install apidoc2ts -g"
                githubLink="https://github.com/fluix/web-apidoc2ts"
                npmLink="https://www.npmjs.com/package/apidoc2ts"
            />
        </>
    );
};

export default App;
