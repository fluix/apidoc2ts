import React, {PureComponent} from "react";
import githubLogo from "../../images/github-logo.png";
import npmLogo from "../../images/npm-logo.png";
import "./quick-start.scss";

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
                         src={githubLogo}
                         alt="github logo"/>
                </a>
                <a className="quick-start__link"
                   target="_blank"
                   rel="noreferrer noopener"
                   href={this.props.npmLink}>
                    <img className="quick-start__image"
                         src={npmLogo}
                         alt="npm logo"/>
                </a>
            </div>
        );
    }
}
