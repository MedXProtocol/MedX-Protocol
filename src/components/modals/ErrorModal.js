import React, {Component} from 'react';
import GenericOkModal from "./GenericOkModal";

class ErrorModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <GenericOkModal
                showModal={this.props.showModal}
                icon={this.props.icon === undefined ? "ti-support text-danger" : this.props.icon}
                headerText={this.props.headerText === undefined ? "Something went wrong" : this.props.headerText}
                contentText={this.props.contentText === undefined ? "An error occured. Please try again later." : this.props.contentText}
                closeHandler={this.props.closeHandler}
            />
        );
    }
}

export default ErrorModal;