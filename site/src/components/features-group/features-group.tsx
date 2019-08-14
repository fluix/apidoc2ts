import React, {PureComponent} from "react";
import ContentWrapper from "../content-wrapper/content-wrapper";
import Feature, {FeatureProps} from "../feature/feature";
import "./features-group.scss";

interface FeaturesGroupProps {
    features: Array<FeatureProps>;
}

export default class FeaturesGroup extends PureComponent<FeaturesGroupProps, {}> {
    render() {
        return (
            <div className="features-group">
                <ContentWrapper>
                    {this.props.features.map((feature, index) => (
                        <Feature image={feature.image}
                                 description={feature.description}
                                 imageOnLeft={feature.imageOnLeft}
                                 key={index}
                        />
                    ))}
                </ContentWrapper>
            </div>
        );
    }
}
