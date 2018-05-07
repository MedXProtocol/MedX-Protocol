import React from 'react';
import {Link} from 'react-router-dom';
import {Modal} from 'react-bootstrap';
import {getSelectedAccount, commitVote, waitForTxComplete, getListingbyHash} from '../../utils/web3-util';
import {getFileUrl} from '../../utils/storage-util';
import TxMiningModal from "../modals/TxMiningModal";
import ErrorModal from "../modals/ErrorModal";

export class VotingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showVoteModal: true,
            showThankYouModal: false,
            showErrorModal: false,
            showLoadingModal: false,
            showZoomModal: false,
            voteChoice: null,
            salt: null
        };
    }

    componentDidMount() {
        this.getListing();
    }

    getListing = async (event) => {
        getListingbyHash(this.props.match.params.id, function (result) {
            this.setState({listing: result});
            this.props.parentCallback("Vote on Dr. " + result.application.firstName + " " + result.application.lastName + "'s Credentials");
        }.bind(this));
    }

    handleCancelClickModal = (e) => {
        e.preventDefault();
        this.setState({showVoteModal: false});
    }

    persistAndDownloadJSONPollData = (downloadableObject) => {

        let existingVote = localStorage.getItem("vote" + this.state.listing.challengeID);
        console.log("Existing Vote: " + existingVote);
        if ((!downloadableObject || downloadableObject == null) && existingVote) {
            console.log("Fetching Existing Vote: " + existingVote);
            downloadableObject = JSON.parse(existingVote);
        }
        else {
            console.log("storing object: " + downloadableObject);
            localStorage.setItem("vote" + this.state.listing.challengeID, JSON.stringify(downloadableObject));
        }

        console.log("vote stored: ");
        console.log(localStorage.getItem("vote" + this.state.listing.challengeID));

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downloadableObject));
        var dlAnchorElem = document.getElementById('downloadSaltAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "vote_" + downloadableObject.pollID + ".json");
        dlAnchorElem.click();
    }

    handleVoteClickModal = async (e) => {
        e.preventDefault();
        //pollID, voteChoice, salt, numTokens, prevPollID, callback
        let voteChoice = document.getElementById("yesRadioChecked").checked ? 1 : 0;
        let salt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

        let downloadableObject = {};
        downloadableObject.pollID = this.state.listing.challengeID;
        downloadableObject.salt = salt;
        downloadableObject.voteChoice = voteChoice;


        let numTokens = document.getElementById("voteMEDX").value;

        if (numTokens <= 0 || (!document.getElementById("yesRadioChecked").checked && !document.getElementById("noRadioChecked").checked)) {
            document.getElementById("spanValidation").innerHTML = "Please fill out all the form fields."
            document.getElementById("spanValidation").style.display = "block";
            return;
        }

        this.setState({showVoteModal: false});
        this.setState({showLoadingModal: true});

        //Fetch the user's current account so that it can be stored in the JSON file with the salt and voteChoice
        getSelectedAccount(function (account) {
            downloadableObject.address = account;
            this.persistAndDownloadJSONPollData(downloadableObject);
        }.bind(this));


        document.getElementById("spanValidation").style.display = "none";
        console.log(this.state.listing.challengeID + " - " + voteChoice + " - " + numTokens);
        commitVote(this.state.listing.challengeID, voteChoice, salt, numTokens, function (error, result) {
            this.setState({showLoadingModal: false});
            if (!error)
                this.setState({showThankYouModal: true});
            else
                this.setState({showErrorModal: true});
        }.bind(this));
    };

    handleThankYouOKClickModal = (e) => {
        e.preventDefault();
        this.setState({showThankYouModal: false});
        this.props.history.push("/registry-voting");
    }

    handleErrorOKClickModal = (e) => {
        e.preventDefault();
        this.setState({showErrorModal: false});
    }

    handleVoteClick = (e) => {
        e.preventDefault();
        this.setState({showVoteModal: true});
    }

    handleZoomCloseModal = (e) => {
        e.preventDefault();
        this.setState({showZoomModal: false});
    }

    handleImageZoom = (src) => {
        this.setState({showZoomModal: true});
        this.setState({zoomedImageURL: src});
    }

    render() {

        if (!this.state.listing)
            return (
                <div></div>
            )

        return (

            <div className='card'>
                <br/>
                <div className="card-header">
                    <h5 className="card-title">Please vote on whether <strong>Dr. {this.state.listing.application.firstName} {this.state.listing.application.lastName}</strong> is certified
                        in <strong>{this.state.listing.application.specialty}</strong> by reviewing the following information:</h5>
                </div>

                <br/>

                <div className="card-content">
                    <div className="row">
                        <div className="col-lg-1 col-md-1">&nbsp;</div>
                        <div className="col-lg-10 col-md-10">
                            <div className='table-responsive table-striped table-bordered'>
                                <table className="table">
                                    <thead>
                                    <tr style={{fontVariant: 'small-caps', backgroundColor: '#d9d9da'}}>
                                        <th scope="col">Verification</th>
                                        <th scope="col" className="text-center">Supplied Info</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td scope="row">Graduated from <strong>{this.state.listing.application.medSchoolName}</strong></td>
                                        <td className="text-center"><a onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.medSchoolDiplomaDocHash))}><img
                                            style={{maxWidth: '100px', maxHeight: '100px', cursor: 'pointer'}} src={getFileUrl(this.state.listing.application.medSchoolDiplomaDocHash)}/></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Completed <strong>{this.state.listing.application.specialty}</strong> at <strong>{this.state.listing.application.residencyProgram}</strong>
                                        </td>
                                        <td className="text-center"><a onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.residencyDiplomaDocHash))}><img
                                            style={{maxWidth: '100px', maxHeight: '100px', cursor: 'pointer'}} src={getFileUrl(this.state.listing.application.residencyDiplomaDocHash)}/></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Is licensed to practice medicine
                                            in <strong>{this.state.listing.application.medLicenseLocation}</strong> until <strong>{this.state.listing.application.medLicenseExpirationDate}</strong>
                                        </td>
                                        <td className="text-center"><a onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.medLicenseDocHash))}><img
                                            style={{maxWidth: '100px', maxHeight: '100px', cursor: 'pointer'}} src={getFileUrl(this.state.listing.application.medLicenseDocHash)}/></a></td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Is a certified <strong>{this.state.listing.application.specialty}</strong></td>
                                        <td className="text-center"><a onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.specialtyCertificateDocHash))}><img
                                            style={{maxWidth: '100px', maxHeight: '100px', cursor: 'pointer'}}
                                            src={getFileUrl(this.state.listing.application.specialtyCertificateDocHash)}/></a></td>
                                    </tr>
                                    <tr>
                                        <td scope="row">License Number</td>
                                        <td className="text-center"><strong>{this.state.listing.application.medLicenseNumber}</strong></td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Prescriber Number</td>
                                        <td className="text-center"><strong>{this.state.listing.application.prescribesNumber}</strong></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={"col-lg-1 col-md-1"}>&nbsp;</div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-lg-7 col-md-7">&nbsp;</div>
                        <div className="col-lg-2 col-md-2">
                            <Link className="btn btn-fill btn-danger" style={{display: 'block', height: '100%'}} to="/registry-voting/">Cancel</Link>
                        </div>
                        <div className="col-lg-2 col-md-2">
                            <button className="btn btn-fill btn-block btn-primary" onClick={this.handleVoteClick}>Vote</button>
                        </div>
                        <div className="col-lg-1 col-md-1">&nbsp;</div>
                    </div>
                </div>

                <Modal show={this.state.showVoteModal}>
                    <Modal.Header>
                        <h3 className="text-center">Please Cast Your Vote</h3>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <span className="ti-stats-up text-info" style={{fontSize: '46pt'}}>&nbsp;</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-1">&nbsp;</div>
                                    <div className="col-xs-10 text-center">
                                        <h5 className="card-title">Is this doctor certified in <strong>{this.state.listing.application.specialty}</strong>?<br/></h5>
                                    </div>
                                    <div className="col-xs-1">&nbsp;</div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-1">&nbsp;</div>
                                    <div className="col-xs-10 text-center">
                                        <label className="radio-inline"><input id="yesRadioChecked" type="radio" name="doctorCertifiedRadio"/>Yes</label>
                                        <label className="radio-inline"><input id="noRadioChecked" type="radio" name="doctorCertifiedRadio"/>No</label>
                                    </div>
                                    <div className="col-xs-1">&nbsp;</div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-xs-1">&nbsp;</div>
                                    <div className="col-xs-10 text-center">
                                        <h5>How many MEDX tokens would you like to weigh in your vote?</h5>
                                        <div>
                                            <input type="number" style={{maxWidth: '100px', diplay: 'block', margin: '0 auto'}} className="form-control form-control-sm" id="voteMEDX" placeholder="0"/>
                                        </div>
                                    </div>
                                    <div className="col-xs-1">&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="row">
                            <div className="col-lg-6">&nbsp;</div>
                            <div className="col-lg-3">
                                <button onClick={this.handleCancelClickModal} type="button" className="btn btn-default btn-fill btn-sm btn-block">Cancel</button>
                            </div>
                            <div className="col-lg-3">
                                <button onClick={this.handleVoteClickModal} type="button" className="btn btn-primary btn-fill btn-sm btn-block">Vote</button>
                                <span id="spanValidation" style={{color: 'red'}}></span>
                            </div>
                            <div className="col-lg-1">&nbsp;</div>
                        </div>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showThankYouModal}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col text-center">
                                <h4>Thank you for voting!</h4>
                                <p>Please don't forget to reveal your vote in 3 days.</p>
                                <p><a id="downloadSaltThankYou" style={{cursor: 'pointer'}} onClick={() => this.persistAndDownloadJSONPollData(null)}>[IMPORTANT!] Download Your Vote
                                    Salt/Information</a></p>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.handleThankYouOKClickModal} type="button" className="btn btn-default">OK</button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showZoomModal} bsSize="large">
                    <Modal.Body>
                        <div className="row">
                            <div className="col text-center">
                                <br/>
                                <img id="zoomedImage" style={{width: 100 + '%'}} src={this.state.zoomedImageURL}/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.handleZoomCloseModal} type="button" className="btn btn-default">Close</button>
                    </Modal.Footer>
                </Modal>

                <TxMiningModal showLoadingModal={this.state.showLoadingModal} />
                <ErrorModal showModal={this.state.showErrorModal} closeHandler={this.handleErrorOKClickModal}/>

                <div><a id="downloadSaltAnchorElem" style={{display: 'none'}}></a></div>
            </div>
        );
    }
}
