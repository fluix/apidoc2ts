import React from "react";
import Header from "./components/header/header";
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
        </>
    );
};

export default App;
