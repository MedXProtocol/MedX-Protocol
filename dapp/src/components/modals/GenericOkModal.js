import React, {Component} from 'react';
import {Modal} from "react-bootstrap";

class GenericOkModal extends Component {
    constructor(props) {
        super(props);
        this.state = {showModal: false};
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.showModal !== this.state.showModal) {
            this.setState({showModal: nextProps.showModal});
        }
    }

    handleErrorOKClickModal = (e) => {
        this.setState({showModal: false});
    }

    render() {
        return (
            <Modal show={this.state.showModal}>

                <Modal.Header>
                    <h3 className="text-center">{this.props.headerText}</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <span className={"text-info " + (this.props.icon === undefined ? "ti-announcement" : this.props.icon)} style={{fontSize: '46pt'}}>&nbsp;</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-1">&nbsp;</div>
                                <div className="col-xs-10 text-center">
                                    <h5 className="card-title">{this.props.contentText}</h5>
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
                            <button onClick={this.props.closeHandler === undefined ? this.handleErrorOKClickModal : this.props.closeHandler} type="button" className="btn btn-default btn-sm btn-block">OK</button>
                        </div>
                        <div className="col-lg-1">&nbsp;</div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default GenericOkModal;
