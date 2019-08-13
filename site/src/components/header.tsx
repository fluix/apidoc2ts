import React, {PureComponent} from "react";
import styles from "../styles/header.module.scss";

interface HeaderProps {
    title: string;
}

export default class Header extends PureComponent<HeaderProps, {}> {
    render() {
        return (
            <header className={styles.header}>
                <span className={styles.header__text}>
                    {this.props.title}
                </span>
            </header>
        );
    }
}
