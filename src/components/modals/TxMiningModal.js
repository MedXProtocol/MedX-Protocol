import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import spinner from '../../img/spinner.gif';

class TxMiningModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal show={this.props.showLoadingModal}>
                <Modal.Header>
                    <h3 className="text-center">Waiting for transaction to be mined...</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <img style={{maxWidth: '100px'}} src={spinner}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-1">&nbsp;</div>
                                <div className="col-xs-10 text-center">
                                    <h5 className="card-title">Please be patient. </h5>
                                </div>
                                <div className="col-xs-1">&nbsp;</div>
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

export default TxMiningModal;