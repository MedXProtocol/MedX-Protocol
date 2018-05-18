import React from 'react';
import { Modal } from 'react-bootstrap';
import {
  challenge,
  getListingbyHash,
  approveRegistryAllowance
} from '../../utils/web3-util';
import { getFileUrl, uploadJson } from '../../utils/storage-util';
import ErrorModal from '../../components/modals/ErrorModal';
import GenericOkModal from '../../components/modals/GenericOkModal';
import DoubleTxMiningModal from '../../components/modals/DoubleTxMiningModal';

class ChallengeView extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      form: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      showThankYouModal: false,
      showErrorModal: false,
      showLoadingModal: false,
      showZoomModal: false,
      processTx1: false,
      processTx2: false,
      verified: false
    };

    this.hasSelectedChallenge = this.hasSelectedChallenge.bind(this);
  }

  componentDidMount () {
    this.getListing();
  }

  getListing = async (event) => {
    getListingbyHash(this.props.match.params.id, (result) => {
      this.setState({ listing: result });
      this.props.parentCallback('Review ' + result.application.physicianName + '\'s Credentials');
      const verified = localStorage.getItem('verify' + result.listingHash);
      console.log('verified: ', verified);
      if (verified !== null && verified) {
        this.setState({ verified: true });
      }
    });
  };

  handleThankYouOKClickModal = () => {
    this.setState({ showThankYouModal: false });
    this.props.history.push('/registry-application');
  };

  handleThankYouChallengeOKClickModal = () => {
    this.setState({ showThankYouChallengeModal: false });
    this.props.history.push('/registry-application');
  };

  handleVerifyClick = () => {
    localStorage.setItem('verify' + this.state.listing.listingHash, 'true');
    this.setState({ showThankYouModal: true });
  };

  handleChallengeClick = async (e) => {
    this.setState({ showLoadingModal: true, processTx1: true });
    const challengeReasonIndexesObj = {};
    let challengeReasonIndexes = Object.keys(this.state.form).reduce((result, key) => {
      if (this.state.form[key]) {
        result += `${key} `;
      }
      return result;
    }, '');
    challengeReasonIndexesObj.reasonIndexes = challengeReasonIndexes.trim();

    const applicationJson = JSON.stringify(challengeReasonIndexesObj);
    const challengeReasonHash = await uploadJson(applicationJson);

    console.log('Application JSON: ', applicationJson);

    await approveRegistryAllowance(20, async function (error, result) {
      if (!error) {
        this.setState({ processTx1: false, processTx2: true });
        await challenge(this.state.listing.listingHash, challengeReasonHash.toString(), function (error, result) {
          console.log('error: ' + error);
          console.log('result: ' + result);
          if (!error)
            this.setState({ showLoadingModal: false, showThankYouChallengeModal: true, processTx2: false });
          else
            this.setState({ showLoadingModal: false, showErrorModal: true });
        }.bind(this));
      }
      else {
        this.setState({ showLoadingModal: false, showErrorModal: true });
      }
    }.bind(this));
  };

  handleZoomCloseModal = (e) => {
    this.setState({ showZoomModal: false });
  };

  handleImageZoom = (src) => {
    this.setState({
      showZoomModal: true,
      zoomedImageURL: src,
    });
  };

  handleCheckboxChange = (e) => {
    const targetId = e.target.id;
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [targetId]: !prevState.form[targetId]
      }
    }));
  };

  hasSelectedChallenge () {
    return Object.keys(this.state.form).some(key => this.state.form[key]);
  }

  render () {

    if (!this.state.listing) return null;

    return (

      <div className='card'>
        <br/>
        <div className="card-header">
          <h5 className="card-title">Please verify
            whether <strong>{this.state.listing.application.physicianName}</strong> is certified
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
                  <tr style={{ fontVariant: 'small-caps', backgroundColor: '#d9d9da' }}>
                    <th>Verification</th>
                    <th scope="col" className="text-center">Supplied Info</th>
                    <th scope="col" className="text-center">Suspicious?</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td scope="row">Graduated from <strong>{this.state.listing.application.medSchoolName}</strong></td>
                    <td className="text-center">
                      <div
                        onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.medSchoolDiplomaDocHash))}>
                        <img role="presentation"
                          style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
                          src={getFileUrl(this.state.listing.application.medSchoolDiplomaDocHash)}/>
                      </div>
                    </td>
                    <td className="text-center">
                      <input
                        id="1"
                        type="checkbox"
                        checked={this.state.form['1']}
                        onClick={this.handleCheckboxChange}/>
                    </td>
                  </tr>
                  <tr>
                    <td scope="row">
                      Completed <strong>{this.state.listing.application.specialty}</strong> at <strong>{this.state.listing.application.residencyProgram}</strong>
                    </td>
                    <td className="text-center"><a
                      onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.residencyDiplomaDocHash))}><img role="presentation"
                      style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
                      src={getFileUrl(this.state.listing.application.residencyDiplomaDocHash)}/></a>
                    </td>
                    <td className="text-center">
                      <input id="2"
                             type="checkbox"
                             checked={this.state.form['2']}
                             onClick={this.handleCheckboxChange}/>
                    </td>
                  </tr>
                  <tr>
                    <td scope="row">Is licensed to practice medicine
                      in <strong>{this.state.listing.application.medLicenseLocation}</strong> until <strong>{this.state.listing.application.medLicenseExpirationDate}</strong>
                    </td>
                    <td className="text-center"><a
                      onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.medLicenseDocHash))}><img role="presentation"
                      style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
                      src={getFileUrl(this.state.listing.application.medLicenseDocHash)}/></a></td>
                    <td className="text-center">
                      <input
                        id="3"
                        type="checkbox"
                        checked={this.state.form['3']}
                        onClick={this.handleCheckboxChange}/>
                    </td>
                  </tr>
                  <tr>
                    <td scope="row">Is certified in <strong>{this.state.listing.application.specialty}</strong></td>
                    <td className="text-center"><a
                      onClick={() => this.handleImageZoom(getFileUrl(this.state.listing.application.specialtyCertificateDocHash))}><img role="presentation"
                      style={{ maxWidth: '100px', maxHeight: '100px', cursor: 'pointer' }}
                      src={getFileUrl(this.state.listing.application.specialtyCertificateDocHash)}/></a></td>
                    <td className="text-center">
                      <input
                        id="4"
                        type="checkbox"
                        checked={this.state.form['4']}
                        onClick={this.handleCheckboxChange}/>
                    </td>
                  </tr>
                  <tr>
                    <td scope="row">License Number</td>
                    <td className="text-center"><strong>{this.state.listing.application.medLicenseNumber}</strong></td>
                    <td className="text-center">
                      <input
                        id="5"
                        type="checkbox"
                        checked={this.state.form['5']}
                        onClick={this.handleCheckboxChange}/>
                    </td>
                  </tr>
                  <tr>
                    <td className="" scope="row">Prescriber Number</td>
                    <td className="text-center"><strong>{this.state.listing.application.prescribesNumber}</strong></td>
                    <td className="text-center">
                      <input
                        id="6"
                        type="checkbox"
                        checked={this.state.form['6']}
                        onClick={this.handleCheckboxChange}/>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={'col-lg-1 col-md-1'}>&nbsp;</div>
          </div>
        </div>
        <div className="card-footer">
          <div className={'row'}>
            <div className="col-lg-7 col-md-7">&nbsp;</div>
            <div className="col-lg-2 col-md-2">
              <button disabled={this.hasSelectedChallenge()}
                      className={'btn btn-block btn-fill btn-primary ' + (this.state.verified === true ? 'hidden' : null)}
                      onClick={this.handleVerifyClick}>Verify
              </button>
            </div>
            <div className="col-lg-2 col-md-2">
              <button disabled={!this.hasSelectedChallenge()} className="btn btn-block btn-fill btn-warning"
                      onClick={this.handleChallengeClick}>Challenge
              </button>
            </div>
            <div className="col-lg-1 col-md-1">&nbsp;</div>
          </div>
        </div>

        <GenericOkModal showModal={this.state.showThankYouModal} headerText={'Verification Successful'}
                        contentText={'Thank you for verifying this entry in the registry.'}
                        closeHandler={this.handleThankYouOKClickModal}/>
        <GenericOkModal showModal={this.state.showThankYouChallengeModal} headerText={'Challenge Successful'}
                        contentText={'Thank you, your challenge has been recorded.'}
                        closeHandler={this.handleThankYouChallengeOKClickModal}/>
        <ErrorModal showModal={this.state.showErrorModal}/>

        <Modal show={this.state.showZoomModal} bsSize="large">
          <Modal.Body>
            <div className="row">
              <div className="col text-center">
                <br/>
                <img role="presentation" id="zoomedImage" style={{ width: 100 + '%' }} src={this.state.zoomedImageURL}/>
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
          tx1Desc={'Transferring required tokens'}
          tx2Desc={'Registering challenge'}/>


        <div><a id="downloadSaltAnchorElem" style={{ display: 'none' }}></a></div>
      </div>
    );
  }
}

export default ChallengeView;
