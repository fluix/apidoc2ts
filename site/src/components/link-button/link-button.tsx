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
            <a className="link-button"
               target="_blank"
               href={this.props.link}
            >
                <div className="link-button__text">{this.props.text}</div>
                <img className="link-button__image" src={this.props.image} alt=""/>
            </a>
        );
    }
}
