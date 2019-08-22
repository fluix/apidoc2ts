import React from "react";
import ButtonsGroup from "./components/buttons-group/buttons-group";
import FeaturesGroup from "./components/features-group/features-group";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import LinkButton from "./components/link-button/link-button";
import Terminal from "./components/terminal/terminal";
import Title from "./components/title/title";
import {features, links, terminalLines} from "./config";
import githubLogo from "./images/github-logo.png";
import npmLogo from "./images/npm-logo.png";
import titleImage from "./images/title_image.svg";

const App: React.FC = () => {
    return (
        <>
            <Header>ApiDoc2ts</Header>
            <Title
                text="Get rid of boring day to day manual retyping"
                image={titleImage}
            />
            <FeaturesGroup features={features}/>
            <Terminal lines={terminalLines}/>
            <ButtonsGroup>
                <LinkButton
                    text="GitHub"
                    image={githubLogo}
                    link={links.github}
                />
                <LinkButton
                    text="npm"
                    image={npmLogo}
                    link={links.npm}
                />
            </ButtonsGroup>
            <Footer/>
        </>
    );
};

export default App;
