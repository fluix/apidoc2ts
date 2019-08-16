import React, {PureComponent} from "react";
import {links} from "../../config";
import ContentWrapper from "../content-wrapper/content-wrapper";
import QuickStart from "../quick-links/quick-start";
import "./title.scss";

interface TitleProps {
    image: string;
    text: string;
}

export default class Title extends PureComponent<TitleProps, {}> {
    render() {
        return (
            <div className="title">
                <ContentWrapper>
                    <img className="title__image" src={this.props.image} alt=""/>
                    <div className="title__group">
                        <span className="title__text">{this.props.text}</span>
                        <QuickStart
                            installCommand="npm install apidoc2ts -g"
                            githubLink={links.github}
                            npmLink={links.npm}
                        />
                    </div>
                </ContentWrapper>
            </div>
        );
    }
}
