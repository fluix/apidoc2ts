import React, {PureComponent} from "react";
import controlsImage from "../../images/traffic-lights.svg";
import ContentWrapper from "../content-wrapper/content-wrapper";
import "./terminal.scss";

interface TerminalProps {
    lines: Array<string>;
}

export default class Terminal extends PureComponent<TerminalProps, {}> {
    render() {
        const lines = this.props.lines.map((line, index) =>
            <code className="terminal__line" key={index}>$ {line}</code>,
        );

        return (
            <div className="terminal">
                <ContentWrapper>
                    <div className="terminal__window">
                        <img className="terminal__controls-image" src={controlsImage} alt="terminal controls"/>
                        <div>{lines}</div>
                    </div>
                </ContentWrapper>
            </div>
        );
    }
}
