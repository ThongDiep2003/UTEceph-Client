import React from "react"

export default function TextFieldInput(props){
  return <fieldset className={`border rounded ${props.className ? props.className : '' }`}>
    <legend style={{ fontSize: '1rem'}} className="mx-auto mb-0 float-none w-auto px-1 text-capitalize mc-color fw-bold">
      {props.legend}
    </legend>
    <input className={`border-0 px-2 py-1 ${props.classNameInput?props.classNameInput:''}`} style={{ width:'100%',height:'100%',outline:'none'}} type={props.type} value={props.value} onChange={e=>props.onChange(e.target.value)} onBlur={props.onBlur} disabled={props.disabled}
    placeholder={props.placeholder}/>
  </fieldset>
}