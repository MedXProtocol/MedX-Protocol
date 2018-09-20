import React from 'react';
import { Modal } from 'react-bootstrap';

const InsufficientFundsModal = ({
                                  show,
                                  onOk
                                }) => (
  <Modal show={show}>
    <Modal.Header>
      <h3 className="text-center">Insufficient Funds</h3>
    </Modal.Header>
    <Modal.Body>
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span className="ti-support text-danger" style={{ fontSize: '46pt' }}>&nbsp;</span>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-1">&nbsp;</div>
            <div className="col-xs-10 text-center">
              <h5 className="card-title">You need 20 MEDX to submit an application.</h5>
            </div>
            <div className="col-xs-1">&nbsp;</div>
          </div>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <div className="row">
        <div className="col-lg-8">&nbsp;</div>
        <div className="col-lg-3">
          <button onClick={onOk} type="button" className="btn btn-default btn-sm btn-block">OK</button>
        </div>
        <div className="col-lg-1">&nbsp;</div>
      </div>
    </Modal.Footer>
  </Modal>
);

export default InsufficientFundsModal;