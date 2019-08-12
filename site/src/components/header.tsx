import React, {PureComponent} from "react";
import styles from "../styles/header.module.css";

interface HeaderProps {
    title: string;
}

export default class Header extends PureComponent<HeaderProps, {}> {
    render() {
        return (
            <div className={styles.Header}>
                <span className={styles.Header__text}>
                    {this.props.title}
                </span>
            </div>
        );
    }
}
