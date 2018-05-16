import React from 'react';
import { Modal } from 'react-bootstrap';

const ConfirmSubmissionModal = ({
  show,
  onSubmit,
  onCancel
}) => (
  <Modal show={show}>
    <Modal.Body>
      <div className="row">
        <div className="col text-center">
          <h4>Are you sure?</h4>
          <h5>This will require a deposit of 20 MEDX.</h5>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button
        type="button"
        className="btn btn-default"
        onClick={onSubmit}>
        Yes
      </button>
      <button
        type="button"
        className="btn btn-default"
        onClick={onCancel}>
        No
      </button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmSubmissionModal;