import React, {PureComponent} from "react";
import ContentWrapper from "../content-wrapper/content-wrapper";
import "./footer.scss";

export default class Footer extends PureComponent {
    render() {
        return (
            <div className="footer">
                <ContentWrapper>
                    <span className="footer__text">Copyright (c) 2019 Fluix Limited</span>
                </ContentWrapper>
            </div>
        );
    }
}
