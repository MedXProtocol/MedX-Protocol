import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import civic from 'civic';
import axios from 'axios';
import { apply, getSelectedAccountBalance, approveRegistryAllowance, getListingbyId } from '../../utils/web3-util';

import Spinner from '../../components/spinner/Spinner';
import { uploadJson, uploadFile } from '../../utils/storage-util';
import ErrorModal from '../../components/modals/ErrorModal';
import DoubleTxMiningModal from '../../components/modals/DoubleTxMiningModal';
import GenericLoadingModal from '../../components/modals/GenericLoadingModal';
import GenericOkModal from '../../components/modals/GenericOkModal';

import ApplyForm from './components/ApplyForm';
import InsufficientFundsModal from './components/InsufficientFundsModal';
import ConfirmSubmissionModal from './components/ConfirmSubmissionModal';


class Apply extends Component {

  constructor () {
    super();

    this.state = {
      form: {
        userId: null,
        physicianName: null,

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
        medLicenseStateLocation: null,
        specialtyCertificteLocation: "N/A",
        medSchoolName: null,
        residencyProgram: null,
        specialty: null,
        prescribesNumber: null,
        additionalInformation: null,
        officePhone: null,
        officeAddress: null,
        languagesSpoken: null,
      },
      testMode: false,
      submitInProgress: false,
      fileUploadInProgress: false,
      showConfirmSubmissionModal: false,
      showBalanceTooLowModal: false,
      showThankYouModal: false,
      showErrorModal: false,
      showLoadingModal: false,
      showFileSizeTooBig: false,
      civicLoading: false,
      showAlreadyRegistered: false,
      showNoCivicDocuments: false,

      processTx1: false,
      processTx2: false
    };

    this.captureFile = this.captureFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handCivicError = this.handCivicError.bind(this);
    this.isSubmitDisabled = this.isSubmitDisabled.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.submitApplication = this.submitApplication.bind(this);
    this.navigateToRegistry = this.navigateToRegistry.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAuthCodeReceived = this.handleAuthCodeReceived.bind(this);
    this.handleAcceptConfirmSubmissionModal = this.handleAcceptConfirmSubmissionModal.bind(this);
  }

  componentDidMount () {
    this.props.parentCallback('Apply to MedCredits Physician Registry');
    this.setState({testMode: this.props.match.url !== '/apply'});

    if (this.props.match.url === '/apply') {
      const civicSip = new civic.sip({ appId: 'HJZgzIcTM' });
      civicSip.on('auth-code-received', this.handleAuthCodeReceived);
      civicSip.on('civic-sip-error', this.handCivicError);
      civicSip.on('user-cancelled', this.navigateToRegistry);
      civicSip.login({ style: 'popup', scopeRequest: civicSip.ScopeRequests.BASIC_SIGNUP });
    } else {
      this.setState(prevState => ({
        form: {
          ...prevState.form,
          userId: Date.now(),
        }
      }));
    }
  }

  async handleFileInputChange (e) {
    if (e.target.files[0].size < 3000000) {
      const fileName = e.target.files[0].name;
      const {name} = e.target;
      const imageHash = await this.captureFile(e);
      this.setState(prevState => ({
        form: {
          ...prevState.form,
          ...{
            [`${name}DocHash`]: imageHash,
            [`${name}DocFileName`]: fileName,
          }
        }
      }));
    } else {
      this.setState({showFileSizeTooBig: true});
    }
  }

  handleInputChange (e) {
    const { name, value } = e.target;
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [name]: value
      }
    }));
  }

  async captureFile (e) {
    this.setState({ fileUploadInProgress: true });
    const file = e.target.files[0];
    const imageHash = await uploadFile(file);
    this.setState({ fileUploadInProgress: false });
    return imageHash;
  }

  isSubmitDisabled () {
    return Object.keys(this.state.form)
      .filter(key => key !== 'additionalInformation')
      .some(key => !this.state.form[key]);
  }

  async handleSubmit (e) {
    e.preventDefault();
    const accountBalance = await getSelectedAccountBalance();
    if (accountBalance < 20) {
      this.setState({ showBalanceTooLowModal: true });
    } else {
      this.setState({ showConfirmSubmissionModal: true });
    }
  }

  navigateToRegistry () {
    this.props.history.push('/registry-application');
  }

  handleModalClose (modalName) {
    return () => {
      this.setState({ [modalName]: false });
    };
  }

  handleAcceptConfirmSubmissionModal () {
    this.setState({ showConfirmSubmissionModal: false });
    this.submitApplication();
  }

  handCivicError (error) {
    console.log('   Error type = ' + error.type);
    console.log('   Error message = ' + error.message);
    this.setState({ showErrorModal: true });
  }

  handleAuthCodeReceived (event) {
    this.setState({ civicLoading: true });

    const apiKey = 'jAWxgBs6fo49pq7Vx8wMgW1uyr9LAWb90l718EWa';
    const jwtToken = event.response;
    axios({
      url: '/CivicServer',
      method: 'POST',
      baseURL: 'https://wdpmsvxesi.execute-api.us-east-1.amazonaws.com/medcredits',
      header: { 'x-api-key': apiKey },
      data: { 'jwtToken': jwtToken }
    }).then((userObject) => {
      getListingbyId(userObject.data.userId).then((listingData) => {
        this.setState({ civicLoading: false });
        let _physicianName = null;
        userObject.data.data.forEach((item) => {
          //TODO: Change this to save physician name
          //if (item.label === 'documents.genericId.name') {
          if (item.label === 'contact.personal.email') {
            _physicianName = item.value;
            this.setState(prevState => ({
                form: {
                    ...prevState.form,
                    userId: userObject.data.userId,
                    physicianName: _physicianName,
                }
            }));
          }
        });

        if (_physicianName === null) {
          this.setState({ showNoCivicDocuments: true });
        } else if (listingData[2] !== '0x0000000000000000000000000000000000000000') {
          this.setState({ showAlreadyRegistered: true });
        }
      });
    }).catch((error) => {
      this.setState({ showErrorModal: true });
      console.log(error);
    });
  };

  async submitApplication () {
    this.setState({
      submitInProgress: true,
      processTx1: true
    });
    const { form } = this.state;
    const applicationJson = JSON.stringify(form);
    const hash = await uploadJson(applicationJson);

    await approveRegistryAllowance(20, async approveError => {
      if (approveError) {
        this.setState({
          submitInProgress: false,
          showErrorModal: true,
          processTx1: false
        });
        return;
      }
      this.setState({
        processTx1: false,
        processTx2: true
      });
      await apply(form.userId, hash, applyError => {
        if (applyError) {
          this.setState({
            submitInProgress: false,
            showErrorModal: true,
            processTx2: false
          });
          return;
        }
        this.setState({
          submitInProgress: false,
          showThankYouModal: true,
          processTx2: false
        });
      });
    });
  }

  render () {
    return (
      <div className="card">
        <ApplyForm
          form={this.state.form}
          isTestMode={this.state.testMode}
          isSubmitDisabled={this.isSubmitDisabled()}
          onSubmit={this.handleSubmit}
          onFileInputChange={this.handleFileInputChange}
          onTextInputChange={this.handleInputChange}
          onDropdownSelectChange={this.handleInputChange}/>

        <InsufficientFundsModal
          show={this.state.showBalanceTooLowModal}
          onOk={this.handleModalClose('showBalanceTooLowModal')}/>
        <ConfirmSubmissionModal
          show={this.state.showConfirmSubmissionModal}
          onSubmit={this.handleAcceptConfirmSubmissionModal}
          onCancel={this.handleModalClose('showConfirmSubmissionModal')}/>
        <GenericOkModal
          showModal={this.state.showThankYouModal}
          headerText={'Thank you for your application'}
          contentText={'Your application will be reviewed within 3 days.'}
          closeHandler={this.navigateToRegistry}/>
        <GenericOkModal
          showModal={this.state.showFileSizeTooBig}
          headerText={'Attachment exceeds 3mb size limit'}
          contentText={'The attachment you want to upload is too big, please use a smaller one'} />
        <GenericOkModal
          showModal={this.state.showAlreadyRegistered}
          headerText={'Welcome ' + this.state.form.physicianName}
          contentText={'You have already applied to be part of the registry. You can view your application by using the menu links on the left.'}
          closeHandler={this.navigateToRegistry}/>
        <GenericOkModal
          showModal={this.state.showNoCivicDocuments}
          headerText={'Required Civic Data Not Received'}
          contentText={'Looks like you have not uploaded to the required identity documentation to Civic, please do so before continuing.'}
          closeHandler={this.navigateToRegistry}/>
        <ErrorModal
          showModal={this.state.showErrorModal}
          closeHandler={this.navigateToRegistry}/>
        <GenericLoadingModal
          showModal={this.state.civicLoading}
          headerText={'Loading Data from Civic...'}/>
        <DoubleTxMiningModal
          showModal={this.state.submitInProgress}
          processingTx1={this.state.processTx1}
          processingTx2={this.state.processTx2}
          tx1Desc={'Transferring required tokens'}
          tx2Desc={'Submitting application'}/>

        <Spinner loading={this.state.fileUploadInProgress}/>
      </div>
    );
  }
}

export default withRouter(Apply);