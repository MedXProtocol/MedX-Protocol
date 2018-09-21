import React, {Component} from 'react';
import {Modal} from "react-bootstrap";
import spinner from '~/assets/img/spinner.gif';

class GenericLoadingModal extends Component {
    render() {
        return (


            <Modal show={this.props.showModal}>
                <Modal.Header>
                    <h3 className="text-center">{this.props.headerText === undefined ? "Waiting for transaction to be mined..." : this.props.headerText}</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    {this.props.contentText === undefined ? null : <div>{this.props.contentText}</div>}
                                    <img alt="spinner" style={{maxWidth: '100px'}} src={spinner}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-1">&nbsp;</div>
                                <div className="col-xs-10 text-center">
                                    <h5 className="card-title">Please be patient.</h5>
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

export default GenericLoadingModal;
