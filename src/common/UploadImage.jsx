import React, { useCallback, useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone'

export default function UploadImage(props){
  const {getRootProps, getInputProps} = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles,rejectedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onabort = () => alert('file reading was aborted')
        reader.onerror = () => alert('file reading has failed')
        reader.onload = () => {
          const binaryStr = reader.result
          props.getUrlImage(binaryStr);
          props.getImage(file);
        }
        reader.readAsDataURL(file)
      })
    }
  })

  return (
    <button type="btn" {...getRootProps({className:`dropzone border btn btn-outline-info p-0 m-0 ${props.className}`})} style={props.style}>
      <input {...getInputProps()} />
      <span className="material-symbols-outlined mt-1" style={{fontSize:"30px"}}>
        photo_camera
      </span>
    </button>
  );
}