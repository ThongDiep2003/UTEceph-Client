import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as bootstrap from 'bootstrap';

export default function LoadingModal(props) {
  const loading = useSelector(state => state.general.loading);
  const loadingModalRef = useRef();
  const loadingModal = useRef();

  useEffect(() => {
    loadingModal.current = new bootstrap.Modal(loadingModalRef.current, {});
  }, [])

  useEffect(() => {
    if (loading) loadingModal.current.show();
    else loadingModal.current.hide();
  }, [loading])

  return <div className="modal" tabIndex="-1" ref={loadingModalRef}>
    <div className="modal-dialog modal-dialog-centered modal-sm justify-content-center">
      <div>
        <img src='/assets/gif/loadingGif.gif' alt='Loading...' />
      </div>
    </div>
  </div >
}