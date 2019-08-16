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
            const className = line.type === "command" ? "terminal__command" : "terminal__response";
            const linePrefix = line.type === "command" ? "$ " : "";

            return <pre className={className}
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
