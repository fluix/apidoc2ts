import React, {PureComponent} from "react";
import ContentWrapper from "../content-wrapper/content-wrapper";
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
                    <span className="title__text">{this.props.text}</span>
                </ContentWrapper>
            </div>
        );
    }
}
