import React from "react";
import "./_style.scss";
import { setLocalStorage } from "../../util/localStorage";

export default class Skin extends React.PureComponent {
  constructor(props) {
    super(props);
    this.skin = [
      { color: "#202020", name: "深色" },
      { color: "#F6F6F6", name: "浅色" },
      { color: "#c7332f", name: "红色" },
    ];
  }

  render() {
    return (
      <div className="skin-wrapper">
        {this.skin.map((item, index) => {
          return (
            <div className="theme-wrapper" key={index}>
              <div
                className="theme-icon"
                style={{ backgroundColor: item.color }}
                onClick={this.changeSkin.bind(this, index)}
              />
              <div className="name">{item.name}</div>
            </div>
          );
        })}
      </div>
    );
  }

  changeSkin(index) {
    let name;
    if (index === 0) {
      name = "theme-black";
    } else if (index === 1) {
      name = "theme-white";
    } else {
      name = "theme-red";
    }
    window.document.documentElement.setAttribute("data-theme", name);
    setLocalStorage("_theme", name);
  }
}
