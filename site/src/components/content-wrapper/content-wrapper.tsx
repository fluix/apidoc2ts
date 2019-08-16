import React, {PureComponent} from "react";
import "./content-wrapper.scss";

export default class ContentWrapper extends PureComponent {
    render() {
        return (
            <div className="content-wrapper">
                {this.props.children}
            </div>
        );
    }
}
