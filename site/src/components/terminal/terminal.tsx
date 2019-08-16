import React, {PureComponent} from "react";
import controlsImage from "../../images/traffic-lights.svg";
import ContentWrapper from "../content-wrapper/content-wrapper";
import "./terminal.scss";

interface TerminalProps {
    lines: Array<TerminalLine>;
}

type TerminalLineType = "command" | "response";

export interface TerminalLine {
    type: TerminalLineType;
    text: string;
}

export default class Terminal extends PureComponent<TerminalProps, {}> {
    render() {
        const lines = this.props.lines.map((line, index) => {
            return line.type === "command"
                   ? <TerminalLineCommand key={index}>{line.text}</TerminalLineCommand>
                   : <TerminalLineResponse key={index}>{line.text}</TerminalLineResponse>;
        });

        return (
            <div className="terminal">
                <ContentWrapper>
                    <div className="terminal__window">
                        <img className="terminal__controls-image"
                             src={controlsImage}
                             alt="terminal controls"/>
                        <div>{lines}</div>
                    </div>
                </ContentWrapper>
            </div>
        );
    }
}

class TerminalLineCommand extends PureComponent {
    render() {
        return <pre className="terminal__line">
            $ {this.props.children}
        </pre>;
    }
}

class TerminalLineResponse extends PureComponent {
    render() {
        return <pre className="terminal__line terminal__line--response">
            {this.props.children}
        </pre>;
    }
}
