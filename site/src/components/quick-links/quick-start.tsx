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
            <div className="quick_start">
                <code className="quick_start__command">$ {this.props.installCommand}</code>
                <a className="quick_start__link"
                   href={this.props.githubLink}>
                    <img className="quick_start__image"
                         src={template_image}
                         alt="link"/>
                </a>
                <a className="quick_start__link"
                   href={this.props.npmLink}>
                    <img className="quick_start__image"
                         src={template_image}
                         alt="link"/>
                </a>
            </div>
        );
    }
}
