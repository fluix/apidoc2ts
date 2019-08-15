import React from "react";
import ButtonsGroup from "./components/buttons-group/buttons-group";
import FeaturesGroup from "./components/features-group/features-group";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import LinkButton from "./components/link-button/link-button";
import QuickStart from "./components/quick-links/quick-start";
import Terminal from "./components/terminal/terminal";
import Title from "./components/title/title";
import {features, links} from "./config";
import template_image from "./images/gray-box.png";
import titleImage from "./images/title_image.png";

const App: React.FC = () => {
    return (
        <>
            <Header>ApiDoc2ts</Header>
            <Title
                text="Get rid of boring day to day manual retyping"
                image={titleImage}
            />
            <QuickStart
                installCommand="npm install apidoc2ts -g"
                githubLink={links.github}
                npmLink={links.npm}
            />
            <FeaturesGroup features={features}/>
            <Terminal lines={["code line 1", "code line 2", "code line 3"]}/>
            <ButtonsGroup>
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
            </ButtonsGroup>
            <Footer/>
        </>
    );
};

export default App;
