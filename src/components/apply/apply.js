import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import Spinner from '../spinner/Spinner';
import { isNotEmptyString } from '../../utils/common-util';
import { uploadJson, uploadFile } from '../../utils/storage-util';
import {apply, getSelectedAccountBalance, approveRegistryAllowance} from '../../utils/web3-util';
import ErrorModal from "../modals/ErrorModal"
import SuccessModal from "../modals/SuccessModal";
import DoubleTxMiningModal from "../modals/DoubleTxMiningModal";

class Apply extends Component {

  constructor(){
    super()

    this.state = {
        firstName: null,
        lastName: null,

        medSchoolDiplomaDocHash: null,
        medSchoolDiplomaDocFileName: null,

        residencyDiplomaDocHash: null,
        residencyDiplomaDocFileName: null,

        medLicenseDocHash: null,
        medLicenseDocFileName: null,

        specialtyCertificateDocHash: null,
        specialtyCertificateDocFileName: null,

        medLicenseExpirationDate: null,
        medLicenseNumber: null,
        medLicenseLocation: null,
        specialtyCertificteLocation: null,
        medSchoolName: null,
        residencyProgram: null,
        specialty: null,
        prescribesNumber: null,
        additionalInformation: null,
        officePhone: null,
        officeAddress: null,
        languagesSpoken: null,

        canSubmit: false,
        submitInProgress: false,
        fileUploadInProgress: false,
        showConfirmSubmissionModal: false,
        showBalanceTooLowModal: false,
        showThankYouModal: false,
        showErrorModal: false,
        showLoadingModal: false,

        processTx1: false,
        processTx2: false
    };
    
  }

  componentDidMount = () => {
    this.props.parentCallback("Apply to MedCredits Physician Registry");
  };

  captureMedSchoolDiplomaDoc = async (event) => {
    const fileName = event.target.files[0].name;
    const imageHash = await this.captureFile(event);
    this.setState({
      medSchoolDiplomaDocHash: imageHash,
      medSchoolDiplomaDocFileName: fileName
    }, this.validateInputs); 
  }

  captureResidencyDiplomaDoc = async (event) => {
    const fileName = event.target.files[0].name;
    const imageHash = await this.captureFile(event);
    this.setState({
      residencyDiplomaDocHash: imageHash,
      residencyDiplomaDocFileName: fileName
    }, this.validateInputs); 
  }

  captureMedLicenseDoc = async (event) => {
    const fileName = event.target.files[0].name;
    const imageHash = await this.captureFile(event);
    this.setState({
      medLicenseDocHash: imageHash,
      medLicenseDocFileName: fileName
    }, this.validateInputs); 
  }

  captureSppecialtyCertificateDoc = async (event) => {
    const fileName = event.target.files[0].name;
    const imageHash = await this.captureFile(event);
    this.setState({
      specialtyCertificateDocHash: imageHash,
      specialtyCertificateDocFileName: fileName
    }, this.validateInputs); 
  }

  captureFile = async (event) => {
    this.setState({fileUploadInProgress: true});

    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    const imageHash = await uploadFile(file);

    this.setState({fileUploadInProgress: false}, this.validateInputs);
    return imageHash;
  }

  firstNameUpdated = (event) => {
    this.setState({firstName: event.target.value}, this.validateInputs);
  }

  lastNameUpdated = (event) => {
    this.setState({lastName: event.target.value}, this.validateInputs);
  }

  medLicenseExpirationDateUpdated = (event) => {
    this.setState({medLicenseExpirationDate: event.target.value}, this.validateInputs);
  }

  medLicenseNumberUpdated = (event) => {
    this.setState({medLicenseNumber: event.target.value}, this.validateInputs);
  }

  medLicenseLocationUpdated = (event) => {
    this.setState({medLicenseLocation: event.target.value}, this.validateInputs);
  }

  specialtyCertificteLocationUpdated = (event) => {
    this.setState({specialtyCertificteLocation: event.target.value}, this.validateInputs);
  }

  medSchoolNameUpdated = (event) => {
    this.setState({medSchoolName: event.target.value}, this.validateInputs);
  }

  residencyProgramUpdated = (event) => {
    this.setState({residencyProgram: event.target.value}, this.validateInputs);
  }

  specialtyUpdated = (event) => {
    this.setState({specialty: event.target.value}, this.validateInputs);
  }

  prescribesNumberUpdated = (event) => {
    this.setState({prescribesNumber: event.target.value}, this.validateInputs);
  }

  additionalInformationUpdated = (event) => {
    this.setState({additionalInformation: event.target.value}, this.validateInputs);
  }

  officePhoneUpdated = (event) => {
    this.setState({officePhone: event.target.value}, this.validateInputs);
  }

  officeAddressUpdated = (event) => {
    this.setState({officeAddress: event.target.value}, this.validateInputs);
  }

  languagesSpokenUpdated = (event) => {
    this.setState({languagesSpoken: event.target.value}, this.validateInputs);
  }

  validateInputs = () => {
    const valid = 
        isNotEmptyString(this.state.firstName) &&
        isNotEmptyString(this.state.lastName) &&
        isNotEmptyString(this.state.medSchoolDiplomaDocHash) &&
        isNotEmptyString(this.state.residencyDiplomaDocHash) &&
        isNotEmptyString(this.state.medLicenseDocHash) &&
        isNotEmptyString(this.state.specialtyCertificateDocHash) &&
        isNotEmptyString(this.state.medLicenseExpirationDate) &&
        isNotEmptyString(this.state.medLicenseNumber) &&
        isNotEmptyString(this.state.medLicenseLocation) &&
        isNotEmptyString(this.state.specialtyCertificteLocation) &&
        isNotEmptyString(this.state.medSchoolName) &&
        isNotEmptyString(this.state.residencyProgram) &&
        isNotEmptyString(this.state.specialty) &&
        isNotEmptyString(this.state.prescribesNumber) &&
        isNotEmptyString(this.state.officePhone) &&
        isNotEmptyString(this.state.officeAddress) &&
        isNotEmptyString(this.state.languagesSpoken);

        this.setState({ canSubmit: valid });
  }

  handleSubmit = async (event) => {
    const accountBalance = await getSelectedAccountBalance();

    if(accountBalance < 20) {
        this.setState({showBalanceTooLowModal: true});
    } else {
        this.setState({showConfirmSubmissionModal: true});
    }
  }

  handleCancel = () => {
    this.props.history.push('/');
  }

  handleCloseBalanceTooLowModal = (event) => {
      this.setState({showBalanceTooLowModal: false});
  }

  handleCloseThankYouModal = (event) => {
      event.preventDefault();
      this.setState({showThankYouModal: false});
      this.props.history.push('/registry-application');
  }

  handleCloseErrorModal = (event) => {
      event.preventDefault();
      this.setState({showErrorModal: false});
  }

  handleCancelConfirmSubmissionModal = (event) => {
      this.setState({showConfirmSubmissionModal: false});
  }

  handleAcceptConfirmSubmissionModal = async (event) => {
      this.setState({showConfirmSubmissionModal: false});
      await this.submitApplication();
  }

  submitApplication = async () => {
    this.setState({submitInProgress: true, processTx1: true});

    const applicationObj = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      medSchoolDiplomaDocHash: this.state.medSchoolDiplomaDocHash,
      residencyDiplomaDocHash: this.state.residencyDiplomaDocHash,
      medLicenseDocHash: this.state.medLicenseDocHash,
      specialtyCertificateDocHash: this.state.specialtyCertificateDocHash,
      medLicenseExpirationDate: this.state.medLicenseExpirationDate,
      medLicenseNumber: this.state.medLicenseNumber,
      medLicenseLocation: this.state.medLicenseLocation,
      specialtyCertificteLocation: this.state.specialtyCertificteLocation,
      medSchoolName: this.state.medSchoolName,
      residencyProgram: this.state.residencyProgram,
      specialty: this.state.specialty,
      prescribesNumber: this.state.prescribesNumber,
      additionalInformation: this.state.additionalInformation,
      officePhone: this.state.officePhone,
      officeAddress: this.state.officeAddress,
      languagesSpoken: this.state.languagesSpoken,
    };

    const applicationJson = JSON.stringify(applicationObj);

    const hash = await uploadJson(applicationJson);

    await approveRegistryAllowance(20, async function (error, result) {
        if (!error) {
            this.setState({processTx1: false, processTx2: true});
            await apply(hash, function (_error, _txHash) {
                if (!_error) {
                  this.setState({submitInProgress: false, showThankYouModal: true, processTx2: false});          
                } else {        
                  this.setState({submitInProgress: false, showErrorModal: true, processTx2: false});          
                }
              }.bind(this));    
        }
        else {
            this.setState({submitInProgress: false, showErrorModal: true, processTx1: false});
        }
    }.bind(this));

  }

  render() {
    return (
      <div className="card">
        <form onSubmit={this.handleSubmit} className="form-horizontal">          

          <div className="card-content">

              <div className="row">
                <div className="col-lg-12 col-md-12 top15">
                  <h3>Dr. {this.state.firstName} {this.state.lastName}</h3>
                </div>
              </div>

              <hr />

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Medical School Diploma:<star>*</star></label>
                      <div className="col-xs-8">
                          <label className="btn btn-primary" style={{width: '100%'}}>
                              Browse...<input onChange={this.captureMedSchoolDiplomaDoc} type="file" className="form-control" style={{display: 'none'}} required/>
                          </label>
                          <span>
                              {this.state.medSchoolDiplomaDocFileName}
                          </span>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-lg-6 col-md-6 top15">              
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Residency Diploma:<star>*</star></label>
                      <div className="col-xs-8">
                          <label className="btn btn-primary" style={{width: '100%'}}>
                              Browse...<input onChange={this.captureResidencyDiplomaDoc} type="file" className="form-control" style={{display: 'none'}} required/>
                          </label>
                          <span>
                              {this.state.residencyDiplomaDocFileName}
                          </span>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Medical License:<star>*</star></label>
                      <div className="col-xs-8">
                        <label className="btn btn-primary" style={{width: '100%'}}>
                            Browse...<input onChange={this.captureMedLicenseDoc} type="file" className="form-control" style={{display: 'none'}} required/>
                        </label>
                        <span>
                            {this.state.medLicenseDocFileName}
                        </span>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Specialty Certificate:<star>*</star></label>
                      <div className="col-xs-8">
                          <label className="btn btn-primary" style={{width: '100%'}}>
                              Browse...<input onChange={this.captureSppecialtyCertificateDoc} type="file" className="form-control" style={{display: 'none'}} required/>
                          </label>
                          <span>
                              {this.state.specialtyCertificateDocFileName}
                          </span>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <hr />

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">First Name:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.firstNameUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>                
                </div>
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Last Name:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.lastNameUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Name of Medical School:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.medSchoolNameUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>                
                </div>
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Specialty:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.specialtyUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">License Location:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.medLicenseLocationUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Specialty Location:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.specialtyCertificteLocationUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Expiration Date:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.medLicenseExpirationDateUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Office Phone:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.officePhoneUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">License #:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.medLicenseNumberUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Office Address:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.officeAddressUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Prescriber #:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.prescribesNumberUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Languages Spoken:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.languagesSpokenUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 col-md-6 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-4">Residency Program:<star>*</star></label>
                      <div className="col-xs-8">
                        <input onChange={this.residencyProgramUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-lg-6 col-md-6 top15">
                  &nbsp;
                </div>
              </div>

              <hr />

              <div className="row">
                <div className="col-lg-12 col-md-12 top15">
                  <fieldset>
                    <div className="form-group">
                      <label className="control-label col-xs-2">Additional information about your practice:</label>
                      <div className="col-xs-10">
                        <textarea rows="5" onChange={this.additionalInformationUpdated} type="text" className="form-control" required />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
                         
          </div>
          <div className="card-footer text-right">
            <div className="category" style={{marginRight: 5, marginBottom: 10}}>Required fields <star>*</star></div>                          
              <button onClick={this.handleCancel} className="btn btn-fill btn-danger">Cancel</button>&nbsp;
              <button disabled={!this.state.canSubmit} type="submit" className="btn btn-fill btn-primary">Submit Application</button>            

          </div>
        </form>


        <Modal show={this.state.showBalanceTooLowModal}>
            <Modal.Header>
                <h3 className="text-center">Insufficient Funds</h3>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <span className="ti-support text-danger" style={{fontSize: '46pt'}}>&nbsp;</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-1">&nbsp;</div>
                            <div className="col-xs-10 text-center">
                                <h5 className="card-title">You need 20 MEDX to submit a application.</h5>
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
                        <button onClick={this.handleCloseBalanceTooLowModal} type="button" className="btn btn-default btn-sm btn-block">OK</button>
                    </div>
                    <div className="col-lg-1">&nbsp;</div>
                </div>
            </Modal.Footer>
        </Modal>

        <Modal show={this.state.showConfirmSubmissionModal}>
            <Modal.Body>
                <div className="row">
                    <div className="col text-center">
                        <h4>Are you sure?</h4>
                        <h5>This will require a deposit of 20 MEDX.</h5>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={this.handleAcceptConfirmSubmissionModal} type="button" className="btn btn-default">Yes</button>
                <button onClick={this.handleCancelConfirmSubmissionModal} type="button" className="btn btn-default">No</button>
            </Modal.Footer>
        </Modal>

        <SuccessModal showModal={this.state.showThankYouModal} header={"Thank you"} content={"Your application will be reviewed within 3 days."} closeHandler={this.handleCloseThankYouModal}/>        
        <ErrorModal showModal={this.state.showErrorModal} closeHandler={this.handleCloseErrorModal} />        
        <DoubleTxMiningModal
          showModal={this.state.submitInProgress}
          processingTx1={this.state.processTx1}
          processingTx2={this.state.processTx2}
          tx1Desc={"Transferring required tokens"}
          tx2Desc={"Submitting application"} />

        <Spinner loading={this.state.fileUploadInProgress}/>
      </div>
    );
  }
}

export default Apply