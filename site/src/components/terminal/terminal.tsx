import React, {PureComponent} from "react";
import template_image from "../../images/gray-box.png";
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
                <img className="terminal__controls-image" src={template_image} alt="terminal controls"/>
                <div>{lines}</div>
            </div>
        );
    }
}
