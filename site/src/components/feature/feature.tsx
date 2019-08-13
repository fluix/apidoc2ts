import React, {PureComponent} from "react";
import "./feature.scss";

interface FeatureProps {
    image: string;
    description: string;
    imageOnLeft: boolean;
}

export default class Feature extends PureComponent<FeatureProps, {}> {
    render() {
        const image = <img className="feature__image"
                           src={this.props.image}
                           alt=""/>;

        const description = <span className="feature__description">{this.props.description}</span>;

        const feature = this.props.imageOnLeft
                        ? <>{image}{description}</>
                        : <>{description}{image}</>;

        return (
            <div className="feature">
                {feature}
            </div>
        );
    }
}
