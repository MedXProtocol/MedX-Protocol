import React, {Component} from 'react';
import {Modal} from "react-bootstrap";

class SuccessModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal show={this.props.showModal}>

                <Modal.Header>
                    <h3 className="text-center">{this.props.header}</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <span className="ti-announcement text-info" style={{fontSize: '46pt'}}>&nbsp;</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-1">&nbsp;</div>
                                <div className="col-xs-10 text-center">
                                    <h5 className="card-title">{this.props.content}</h5>
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
                            <button onClick={this.props.closeHandler} type="button" className="btn btn-default btn-sm btn-block">OK</button>
                        </div>
                        <div className="col-lg-1">&nbsp;</div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default SuccessModal;
