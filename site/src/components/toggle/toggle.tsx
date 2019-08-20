import React, {PureComponent} from "react";
import "./toggle.scss";

interface ToggleProps {
    items: Array<{
        value: string;
        label: string;
    }>;
    onToggle: (toggled: string) => void;
    toggled: string;
}

export default class Toggle extends PureComponent<ToggleProps, {}> {

    private onButtonClick = (value: string) => {
        if (value === this.props.toggled) {
            return;
        }

        this.props.onToggle(value);
    };

    render() {
        const buttons = this.props.items.map(item => {
            const buttonModifier = this.props.toggled === item.value ? "toggle__button--toggled" : "";

            return <button
                key={item.value}
                className={`toggle__button ${buttonModifier}`}
                onClick={() => this.onButtonClick(item.value)}
            >
                {item.label}
            </button>;
        });

        return <div className="toggle">{buttons}</div>;
    }
}
