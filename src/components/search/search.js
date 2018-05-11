import React, {Component} from 'react'
const civic = require('civic');
const axios = require('axios');

export class Search extends Component {

    constructor(){
        super();
        this.state = {
            showErrorModal: false,
        };
    }

    componentDidMount = async () => {
        this.props.parentCallback("Civic Integration");

        const civicSip = new civic.sip({ appId: 'SyPITFJRM' });
        civicSip.on('auth-code-received', this.handleAuthCodeReceived);
        civicSip.on('civic-sip-error', this.handCivicError);
    };

    handleCivicLogin = () => {
        const civicSip = this.state.civic;
        civicSip.signup({ style: 'popupa', scopeRequest: civicSip.ScopeRequests.BASIC_SIGNUP });
    };

    handCivicError = (event) => {
        console.log('   Error type = ' + event.type);
        console.log('   Error message = ' + event.message);
    };

    handleAuthCodeReceived = (event) => {
        const apiKey = "QJFv9MWdnj1zKMXlNqyyOaY3ZyXlZnyB1Bb0lxca";
        console.log(event.response);

        const jwtToken = event.response;
        // Your function to pass JWT token to your server

        axios({
            url: "/userdetail",
            method: "POST",
            baseURL: "https://fut4p1vbrb.execute-api.us-east-1.amazonaws.com/medcredits",
            header: {"x-api-key": apiKey, "Access-Control-Allow-Origin": "*"},
            data: { "jwtToken": jwtToken}
        }).then((data) => {
            console.log(data);
        }).catch((error) => {
            console.log(error);
        });
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