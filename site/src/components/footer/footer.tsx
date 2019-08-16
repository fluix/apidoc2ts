import React, {PureComponent} from "react";
import ContentWrapper from "../content-wrapper/content-wrapper";
import "./footer.scss";

export default class Footer extends PureComponent {
    render() {
        return (
            <div className="footer">
                <ContentWrapper>
                    <div className="footer__group">
                        <p className="footer__text">
                            This is an open-source project. Contributing is highly appreciated.
                        </p>
                        <p className="footer__text">
                            Licensed under <a className="footer__link"
                                              target="_blank"
                                              rel="noreferrer noopener"
                                              href="https://opensource.org/licenses/MIT">
                            MIT license</a>
                        </p>
                    </div>
                </ContentWrapper>
            </div>
        );
    }
}
