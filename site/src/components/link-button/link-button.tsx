import React, {PureComponent} from "react";
import "./link-button.scss";

interface LinkButtonProps {
    text: string;
    link: string;
}

export default class LinkButton extends PureComponent<LinkButtonProps, {}> {
    render() {
        return (
            <a className="link_button"
               target="_blank"
               href={this.props.link}
            >
                <div className="link_button__text">{this.props.text}</div>
            </a>
        );
    }
}
