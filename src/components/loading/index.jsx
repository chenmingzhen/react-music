import React from "react";
import ReactDOM from "react-dom";
import { Spin } from "antd";
import "./_style.scss";
import { LoadingOutlined } from "@ant-design/icons";
const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;
export function loading() {
  ReactDOM.render(
    <div className="spin-wrapper" id="spin-wrapper">
      <Spin indicator={antIcon} tip="加载中"/>
    </div>,
    document.getElementById("tmp")
  );
  return function () {
    const wrapper = document.getElementById("spin-wrapper");
    if(wrapper)wrapper.style.opacity = 0;
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById("tmp"));
    }, 1000);
  };
}
