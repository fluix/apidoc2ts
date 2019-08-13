import React, {PureComponent} from "react";
import "./header.scss";

interface HeaderProps {
}

export default class Header extends PureComponent<HeaderProps, {}> {
    render() {
        return (
            <header className="header">
                <span className="header__text">
                    {this.props.children}
                </span>
            </header>
        );
    }
}
