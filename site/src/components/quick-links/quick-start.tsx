import React, {PureComponent} from "react";
import template_image from "../../images/gray-box.png";
import "./quick-links.scss";

interface QuickStartProps {
    installCommand: string;
    githubLink: string;
    npmLink: string;
}

export default class QuickStart extends PureComponent<QuickStartProps, {}> {
    render() {
        return (
            <div className="quick-start">
                <code className="quick-start__command">$ {this.props.installCommand}</code>
                <a className="quick-start__link"
                   href={this.props.githubLink}>
                    <img className="quick-start__image"
                         src={template_image}
                         alt="github logo"/>
                </a>
                <a className="quick-start__link"
                   target="_blank"
                   href={this.props.npmLink}>
                    <img className="quick-start__image"
                         src={template_image}
                         alt="npm logo"/>
                </a>
            </div>
        );
    }
}
