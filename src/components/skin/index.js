import React from "react";
import './_style.scss'

export default class Skin extends React.PureComponent {
    constructor(props) {
        super(props);
        this.skin = [{color: '#202020', name: '深色'}, {color: '#F6F6F6', name: '浅色'}, {color: '#c7332f', name: '红色'}];
    }

    render() {
        return (
            <div className="skin-wrapper">
                {this.skin.map((item, index) => {
                    return (
                        <div className="theme-wrapper" key={index}>
                            <div className="theme-icon" style={{backgroundColor: item.color}}/>
                            <div className="name">{item.name}</div>
                        </div>
                    )
                })}
            </div>
        );
    }
}
