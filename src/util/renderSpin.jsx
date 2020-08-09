import React from "react";
import {Spin} from "antd";

export function renderSpin() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <Spin />
        </div>
    );
}