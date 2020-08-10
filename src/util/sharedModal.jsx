import React from "react";
import { Input } from "antd";
const { TextArea } = Input;

export function sharedModal() {
  return (
    <div className="shared-modal-wrapper">
      <div
        className="title"
        style={{ fontSize: "1.5rem", marginBottom: "1rem" }}
      >
        留下你想说的话吧！
      </div>
      <TextArea rows={4} id={"textarea-shared"} />
    </div>
  );
}
