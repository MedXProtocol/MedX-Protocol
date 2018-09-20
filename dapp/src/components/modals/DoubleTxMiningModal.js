import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import spinner from '../../img/spinner.gif';

class DoubleTxMiningModal extends Component {
    render() {
        return (
            <Modal show={this.props.showModal}>
                <Modal.Header>
                    <h3 className="text-center">Waiting for transactions to be mined...</h3>
                </Modal.Header>
                <Modal.Body>
                    <br />
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="row">
                                <div className="col-xs-1">&nbsp;</div>
                                <div className="col-xs-8 text-left">
                                    <p className="card-title"><b>Step 1:</b> {this.props.tx1Desc}</p>
                                </div>
                                <div className="col-xs-1 text-center">
                                    { this.props.processingTx1 ? <img role="presentation" style={{maxWidth: '30px'}} src={spinner}/> : null }
                                    { !this.props.processingTx1 ? <i className="ti-check text-success" /> : null }
                                </div>
                                <div className="col-xs-2">&nbsp;</div>
                            </div>

                            <div className="row">
                                <div className="col-xs-1">&nbsp;</div>
                                <div className={"col-xs-8 text-left " + (!this.props.processingTx2 ? "text-muted" : "")}>
                                    <p className="card-title"><b>Step 2:</b> {this.props.tx2Desc}</p>
                                </div>
                                <div className="col-xs-1 text-center">
                                    {this.props.processingTx2 ? <img role="presentation" style={{maxWidth: '30px'}} src={spinner}/> : null }
                                </div>
                                <div className="col-xs-2">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    &nbsp;
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DoubleTxMiningModal;