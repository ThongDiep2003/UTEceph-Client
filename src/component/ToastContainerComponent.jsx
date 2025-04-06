import React from 'react';
import { ToastContainer} from 'react-toastify';
import "react-toastify/ReactToastify.min.css";

export default function ToastContainerComponent(props) {
  return <ToastContainer
    style={{bottom:"0em"}}
    position="bottom-left"
    autoClose={1500}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme={'colored'}
  />
}