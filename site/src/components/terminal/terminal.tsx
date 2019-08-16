import React, {PureComponent} from "react";
import controlsImage from "../../images/traffic-lights.svg";
import ContentWrapper from "../content-wrapper/content-wrapper";
import "./terminal.scss";

interface TerminalProps {
    lines: Array<TerminalLine>;
}

export interface TerminalLine {
    type: "command" | "response";
    text: string;
}

export default class Terminal extends PureComponent<TerminalProps, {}> {
    render() {
        const lines = this.props.lines.map((line, index) => {
            const modifier = line.type === "command" ? "" : "terminal__line--response";
            const linePrefix = line.type === "command" ? "$ " : "";

            return <pre className={`terminal__line ${modifier}`}
                        key={index}>
                {linePrefix}{line.text}
            </pre>;
        });

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
