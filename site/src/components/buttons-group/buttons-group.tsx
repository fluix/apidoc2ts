import React, {PureComponent} from "react";
import ContentWrapper from "../content-wrapper/content-wrapper";
import "./buttons-group.scss";

export default class ButtonsGroup extends PureComponent {
    render() {
        return (
            <div className="buttons-group">
                <ContentWrapper>
                    {this.props.children}
                </ContentWrapper>
            </div>
        );
    }
}
