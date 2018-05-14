import React from 'react';
import {Modal} from 'react-bootstrap';
import {
    challenge,
    getListingbyHash,
    approveRegistryAllowance
} from '../../utils/web3-util';
import {getFileUrl, uploadJson} from '../../utils/storage-util';
import ErrorModal from "../modals/ErrorModal";
import GenericOkModal from "../modals/GenericOkModal";
import DoubleTxMiningModal from "../modals/DoubleTxMiningModal";

export class ChallengeView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showThankYouModal: false,
            showErrorModal: false,
            showLoadingModal: false,
            showZoomModal: false,
            disabledButton: false,
            disabledChallengeButton: true,
            processTx1: false,
            processTx2: false,
            verified: false
        };
    }

    componentDidMount() {
        this.getListing();
    }

    getListing = async (event) => {
        getListingbyHash(this.props.match.params.id, function (result) {
            this.setState({listing: result});
            this.props.parentCallback("Review " + result.application.physicianName + "'s Credentials");
            const verified = localStorage.getItem("verify" + result.listingHash);
            console.log("verified: ", verified);
            if (verified !== null && verified) {
                this.setState({verified: true});
            }
        }.bind(this));
    }

    handleThankYouOKClickModal = (e) => {
        e.preventDefault();
        this.setState({showThankYouModal: false});
        this.props.history.push("/registry-application");
    }

    handleThankYouChallengeOKClickModal = (e) => {
        e.preventDefault();
        this.setState({showThankYouChallengeModal: false});
        this.props.history.push("/registry-application");
    }

    handleVerifyClick = (e) => {
        localStorage.setItem("verify" + this.state.listing.listingHash, "true");
        this.setState({showThankYouModal: true});
    }

    handleChallengeClick = async (e) => {
        e.preventDefault();
        this.setState({showLoadingModal: true, processTx1: true});
        const challengeReasonIndexesObj = {};
        let challengeReasonIndexes = "";

        if (document.getElementById("cb1").checked) {
            challengeReasonIndexes += document.getElementById("cb1").value + " ";
        }

        if (document.getElementById("cb2").checked) {
            challengeReasonIndexes += document.getElementById("cb2").value + " ";
        }

        if (document.getElementById("cb3").checked) {
            challengeReasonIndexes += document.getElementById("cb3").value + " ";
        }

        if (document.getElementById("cb4").checked) {
            challengeReasonIndexes += document.getElementById("cb4").value + " ";
        }

        if (document.getElementById("cb5").checked) {
            challengeReasonIndexes += document.getElementById("cb5").value + " ";
        }

        if (document.getElementById("cb6").checked) {
            challengeReasonIndexes += document.getElementById("cb6").value;
        }

        challengeReasonIndexesObj.reasonIndexes = challengeReasonIndexes.trim();

        const applicationJson = JSON.stringify(challengeReasonIndexesObj);
        const challengeReasonHash = await uploadJson(applicationJson);

        console.log("Application JSON: ", applicationJson);

        await approveRegistryAllowance(20, async function (error, result) {
            if (!error) {
                this.setState({processTx1: false, processTx2: true});
                await challenge(this.state.listing.listingHash, challengeReasonHash.toString(), function (error, result) {
                    console.log("error: " + error);
                    console.log("result: " + result);
                    if (!error)
                        this.setState({showLoadingModal: false, showThankYouChallengeModal: true, processTx2: false});
                    else
                        this.setState({showLoadingModal: false, showErrorModal: true});
                }.bind(this));
            }
            else {
                this.setState({showLoadingModal: false, showErrorModal: true});
            }
        }.bind(this));
    };

    handleZoomCloseModal = (e) => {
        e.preventDefault();
        this.setState({showZoomModal: false});
    }

    handleImageZoom = (src) => {
        this.setState({showZoomModal: true});
        this.setState({zoomedImageURL: src});
    }

    handleCheckboxChange = () => {
        //TODO: loop through the checkboxes and verify that all are checked
        //If not all checkboxes are checked, disable the verify button
        let is1Checked = document.getElementById("cb1").checked;
        let is2Checked = document.getElementById("cb2").checked;
        let is3Checked = document.getElementById("cb3").checked;
        let is4Checked = document.getElementById("cb4").checked;
        let is5Checked = document.getElementById("cb5").checked;
        let is6Checked = document.getElementById("cb6").checked;

        if (is1Checked || is2Checked || is3Checked || is4Checked || is5Checked || is6Checked) {
            this.setState({disabledButton: true, disabledChallengeButton: false});
        }
        else {
            this.setState({disabledButton: false, disabledChallengeButton: true});
        }
    };

    render() {

        if (!this.state.listing) {
            return (
                <div></div>
            )
        }

        return (

            <div className='card'>
                <br />
                <div className="card-header">
                    <h5 className="card-title">Please verify whether <strong>{this.state.listing.application.physicianName}</strong> is certified
                        in <strong>{this.state.listing.application.specialty}</strong> by reviewing the following information:</h5>
                </div>

                <br />

                <div className="card-content">
                    <div className="row">
                        <div className="col-lg-1 col-md-1">&nbsp;</div>
                        <div className="col-lg-10 col-md-10">
                            <div className='table-responsive table-striped table-bordered'>
                                <table className="table">
                                    <thead>
                                    <tr style={{fontVariant: 'small-caps', backgroundColor: '#d9d9da'}}>
                                        <th>Verification</th>
                                        <th scope="col" className="text-center">Supplied Info</th>
                                        <th scope="col" className="text-center">Suspicious?</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td scope="row">Graduated from <strong>{this.state.listing.application.medSchoolName}</strong></td>
                                        <td className="text-center">
                                            <div onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.medSchoolDiplomaDocHash))}><img
                                                style={{maxWidth: '100px', maxHeight: '100px', cursor: 'pointer'}} src={getFileUrl(this.state.listing.application.medSchoolDiplomaDocHash)}/>
                                            </div>
                                        </td>
                                        <td className="text-center"><input id="cb1" onClick={() => this.handleCheckboxChange()} type="checkbox" value="0"/></td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            Completed <strong>{this.state.listing.application.specialty}</strong> at <strong>{this.state.listing.application.residencyProgram}</strong></td>
                                        <td className="text-center"><a onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.residencyDiplomaDocHash))}><img
                                            style={{maxWidth: '100px', maxHeight: '100px', cursor: 'pointer'}} src={getFileUrl(this.state.listing.application.residencyDiplomaDocHash)}/></a>
                                        </td>
                                        <td className="text-center"><input id="cb2" onClick={() => this.handleCheckboxChange()} type="checkbox" value="1"/></td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Is licensed to practice medicine
                                            in <strong>{this.state.listing.application.medLicenseLocation}</strong> until <strong>{this.state.listing.application.medLicenseExpirationDate}</strong></td>
                                        <td className="text-center"><a onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.medLicenseDocHash))}><img
                                            style={{maxWidth: '100px', maxHeight: '100px', cursor: 'pointer'}} src={getFileUrl(this.state.listing.application.medLicenseDocHash)}/></a></td>
                                        <td className="text-center"><input id="cb3" onClick={() => this.handleCheckboxChange()} type="checkbox" value="2"/></td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Is certified in <strong>{this.state.listing.application.specialty}</strong></td>
                                        <td className="text-center"><a onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.specialtyCertificateDocHash))}><img
                                            style={{maxWidth: '100px', maxHeight: '100px', cursor: 'pointer'}}
                                            src={getFileUrl(this.state.listing.application.specialtyCertificateDocHash)}/></a></td>
                                        <td className="text-center"><input id="cb4" onClick={() => this.handleCheckboxChange()} type="checkbox" value="3"/></td>
                                    </tr>
                                    <tr>
                                        <td scope="row">License Number</td>
                                        <td className="text-center"><strong>{this.state.listing.application.medLicenseNumber}</strong></td>
                                        <td className="text-center"><input id="cb5" onClick={() => this.handleCheckboxChange()} type="checkbox" value="4"/></td>
                                    </tr>
                                    <tr>
                                        <td className="" scope="row">Prescriber Number</td>
                                        <td className="text-center"><strong>{this.state.listing.application.prescribesNumber}</strong></td>
                                        <td className="text-center"><input id="cb6" onClick={() => this.handleCheckboxChange()} type="checkbox" value="5"/></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={"col-lg-1 col-md-1"}>&nbsp;</div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className={"row"}>
                        <div className="col-lg-7 col-md-7">&nbsp;</div>
                        <div className="col-lg-2 col-md-2">
                            <button disabled={this.state.disabledButton} className={"btn btn-block btn-fill btn-primary " + (this.state.verified === true ? "hidden": null)} onClick={this.handleVerifyClick}>Verify</button>
                        </div>
                        <div className="col-lg-2 col-md-2">
                            <button disabled={this.state.disabledChallengeButton} className="btn btn-block btn-fill btn-warning" onClick={this.handleChallengeClick}>Challenge</button>
                        </div>
                        <div className="col-lg-1 col-md-1">&nbsp;</div>
                    </div>
                </div>

                <GenericOkModal showModal={this.state.showThankYouModal} headerText={"Verification Successful"} contentText={"Thank you for verifying this entry in the registry."} closeHandler={this.handleThankYouOKClickModal}/>
                <GenericOkModal showModal={this.state.showThankYouChallengeModal} headerText={"Challenge Successful"} contentText={"Thank you, your challenge has been recorded."} closeHandler={this.handleThankYouChallengeOKClickModal}/>
                <ErrorModal showModal={this.state.showErrorModal} />

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

                <DoubleTxMiningModal
                    showModal={this.state.showLoadingModal}
                    processingTx1={this.state.processTx1}
                    processingTx2={this.state.processTx2}
                    tx1Desc={"Transferring required tokens"}
                    tx2Desc={"Registering challenge"} />


                <div><a id="downloadSaltAnchorElem" style={{display: 'none'}}></a></div>
            </div>
        );
    }
}
