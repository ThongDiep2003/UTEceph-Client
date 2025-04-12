import React from "react";

export default function IconButtonComponent(props) {
  return <button type="button" style={props.styleButton} className={`btn ${props.className} p-0 text-white-hover`} title={props.title} onClick={props.onClick} disabled={props.disabled}>
    <span className="material-symbols-outlined mt-1 mx-1" style={{fontSize:props.FONT_SIZE_ICON}}>
      {props.icon}
    </span>
  </button>
}