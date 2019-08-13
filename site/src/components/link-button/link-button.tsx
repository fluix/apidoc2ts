import React, {PureComponent} from "react";
import "./link-button.scss";

interface LinkButtonProps {
    text: string;
    link: string;
    image: string;
}

export default class LinkButton extends PureComponent<LinkButtonProps, {}> {
    render() {
        return (
            <a className="link_button"
               target="_blank"
               href={this.props.link}
            >
                <div className="link_button__text">{this.props.text}</div>
                <img className="link_button__image" src={this.props.image} alt=""/>
            </a>
        );
    }
}
