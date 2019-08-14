import React, {PureComponent} from "react";
import ContentWrapper from "../content-wrapper/content-wrapper";
import "./header.scss";

interface HeaderProps {
}

export default class Header extends PureComponent<HeaderProps, {}> {
    render() {
        return (
            <header className="header">
                <ContentWrapper>
                    <span className="header__text">
                        {this.props.children}
                    </span>
                </ContentWrapper>
            </header>
        );
    }
}
