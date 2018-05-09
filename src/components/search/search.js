import React, {Component} from 'react'
const civic = require('civic');

export class Search extends Component {

    constructor(){
        super();
        this.state = {
            showErrorModal: false,
            civic: null
        };
    }

    componentDidMount = async () => {
        this.props.parentCallback("Civic Integration");

        const civicSip = new civic.sip({ appId: 'SyPITFJRM' });
        civicSip.on('auth-code-received', this.handleAuthCodeReceived);
        this.setState({civic: civicSip});
    };

    handleCivicLogin = () => {
        const civicSip = this.state.civic;
        civicSip.signup({ style: 'popup', scopeRequest: civicSip.ScopeRequests.BASIC_SIGNUP });
    };

    handleAuthCodeReceived = (event) => {
        // encoded JWT Token is sent to the server
        console.log(event.response);
    };

    render() {
        return (
            <div className="card">
                <link rel="stylesheet" href="https://hosted-sip.civic.com/css/civic-modal.min.css" />

                <div className="card-header">
                    <h2 className="card-title">Search</h2>
                </div>
                <div className="card-content">
                    <button className="btn btn-primary btn-sm" onClick={this.handleCivicLogin}>Login</button>
                </div>
            </div>
        );
    }
}

export default Search