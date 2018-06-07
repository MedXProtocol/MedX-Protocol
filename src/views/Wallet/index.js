import React, { Component } from 'react';
import {
    getSelectedAccountBalance,
    getSelectedAccount,
    getVotingTokensBalance,
    requestVotingRights,
    withdrawVotingRights, getAllListings, exitRegistry, withdrawUnstakedDeposit, getSelectedAccountEthBalance
} from '../../utils/web3-util';
import { Modal } from 'react-bootstrap';

import WalletCard from './components/WalletCard';

import GenericLoadingModal from '../../components/modals/GenericLoadingModal';
import ErrorModal from '../../components/modals/ErrorModal';
import './wallet.css';

class Wallet extends Component {
  constructor () {
    super();

    this.state = {
      balance: '0',
      accountEthBalance: '0',
      selectedAccount: '0',
      votingTokens: '0',
      addVotingTokens: '0',
      withdrawVotingTokens: '0',
      listingStatus: "N/A",
      submitInProgress: false,
      showManageVotingTokensModal: false,
      showErrorModal: false,
      ownerListings: [],
      tableDisplayString: "none"
    };
  }

  componentDidMount = async () => {
    this.props.parentCallback('My Account');

    const accountBalance = await getSelectedAccountBalance();
    const accountEthBalance = await getSelectedAccountEthBalance();
    const selectedAccount = await getSelectedAccount();
    const votingTokens = await getVotingTokensBalance();
    this.getOwnerListing(selectedAccount);

    this.setState({
      balance: accountBalance.toFixed(3),
      ethBalance: accountEthBalance.toFixed(3),
      account: selectedAccount,
      votingTokens: votingTokens.toFixed(3)
    });
  };

  getOwnerListing = (selectedAccount) => {
      getAllListings((result) => {
          const isListed = result.filter(listing => listing.owner.toLowerCase() === selectedAccount.toLowerCase());
          if (isListed.length > 0) {
            isListed.forEach(listing => {
              console.log("Listing", listing);
                const challenged = !(listing.challengeID <= 0 || listing.challenge.resolved);
                const newApp = !listing.whitelisted;

                let status = "Active";
                if (newApp)
                  status = "New Application";
                else if (challenged)
                  status = "Challenged";

                this.setState({
                    [`${listing.listingHash}ListingStatus`]: status,
                });
            });
          } else {
            console.log("Account does not have an application");
          }
          this.setState({
              ownerListings: isListed,
              tableDisplayString: "block"
          });
      });
  };

  handleAddVotingTokensSubmit = (event) => {
    event.preventDefault();
    this.addVotingTokens();
  };

  handleWithdrawVotingTokensSubmit = (event) => {
    event.preventDefault();
    this.withdrawVotingTokens();
  };

  handleVotingTokensManageClick = (event) => {
    this.setState({ showManageVotingTokensModal: true });
  };

  handleCloseManageVotingTokensModal = (event) => {
    this.setState({ showManageVotingTokensModal: false });
  };

  addVotingTokens = async () => {
    this.setState({ submitInProgress: true, showManageVotingTokensModal: false });
    await requestVotingRights(this.state.addVotingTokens, (error, result) => {
      if (!error) {
        const newVoteTokenBalance = parseInt(this.state.votingTokens, 10) + parseInt(this.state.addVotingTokens, 10);
        this.onSuccess(newVoteTokenBalance);
      } else {
        this.onError();
      }
    });
  };

  withdrawVotingTokens = async () => {
    this.setState({ submitInProgress: true, showManageVotingTokensModal: false });
    await withdrawVotingRights(this.state.withdrawVotingTokens, (error, result) => {
      if (!error) {
        const newVoteTokenBalance = parseInt(this.state.votingTokens, 10) - parseInt(this.state.withdrawVotingTokens, 10);
        this.onSuccess(newVoteTokenBalance);
      } else {
        this.onError();
      }
    });
  };

  handleExitClick = async (e) => {
    e.preventDefault();
    this.setState({ submitInProgress: true });
    console.log("event", e);
    console.log("event target", e.target);
    await exitRegistry(e.target.id, (error, result) => {
        if (!error) {
          this.setState({ submitInProgress: false });
          console.log("Successfully exited the registry");
        } else {
          console.log("Error while exiting the registry");
          this.onError();
        }
    });
  }

    handleWithdrawUnstakedClick = async (e) => {
    e.preventDefault();
    this.setState({ submitInProgress: true });

    await withdrawUnstakedDeposit(e.target.id, (error, result) => {
        if (!error) {
          this.setState({ submitInProgress: false });
          console.log("Successfully exited the registry");
        } else {
          console.log("Error while exiting the registry");
          this.onError();
        }
    });
  }

  updatedAddVotingTokens = (event) => {
    this.setState({ addVotingTokens: event.target.value });
  };

  updatedWithdrawVotingTokens = (event) => {
    this.setState({ withdrawVotingTokens: event.target.value });
  };

  onSuccess = (newVoteBalance) => {
    getSelectedAccountBalance().then((_balance) => {
      this.setState({
        balance: _balance.toFixed(3),
        votingTokens: newVoteBalance.toFixed(3),
        submitInProgress: false,
      });
    });
  };

  onError = () => {
    this.setState({ submitInProgress: false, showErrorModal: true });
  };

  render () {
    return (
      <div className="container-fluid">

        <div className="row">
          {this.state.ownerListings.map((listing, index) => {
              return (

                  <div className="col-lg-6 col-md-12">
                      <div className="card card-wallet card-account-address" style={{minHeight: 245}}>
                          <div className="card-header">
                              <div className="row">
                                  <div className="col-xs-2">
                                      <div className={`icon-big icon-success text-center`}>
                                          <i className="ti-user"/>
                                      </div>
                                  </div>
                                  <div className="col-xs-10 text-right">
                                      <h4 className="card-title"><b>{listing.application.physicianName}</b></h4>
                                      <div>
                                          <p className="category">Current Listing Status:</p>
                                          <p className={this.state[`${listing.listingHash}ListingStatus`] === 'Active' ? "badge badge-success" : this.state[`${listing.listingHash}ListingStatus`] === 'New Application' ? "badge badge-warning": "badge badge-challenge"}>{this.state[`${listing.listingHash}ListingStatus`]}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="card-content">
                              <div className="row">
                                  <div className="col-xs-12">
                                      <div className="row numbers">
                                          <div className="col-lg-6">
                                              <div className="text-left text-muted">Unstaked Deposit:</div>
                                          </div>
                                          <div className="col-lg-6">
                                              <div className="text-right ">{(listing.unstakedDeposit / 10 ** 18).toFixed(3) + " MEDX"} <a href="#" className="btn btn-block btn-primary"  onClick={this.handleWithdrawUnstakedClick}><span className="ti-wallet" id={listing.listingHash}/>&nbsp;&nbsp;&nbsp;&nbsp;Withdraw</a></div>
                                          </div>
                                      </div>
                                      <br />
                                      <br />
                                      <div className="row">
                                          <div className="col-lg-6">
                                              {
                                                  listing.whitelisted &&
                                                  this.state[`${listing.listingHash}ListingStatus`] === 'Active' &&
                                                  <div className="text-right">
                                                      <a href="#" className="btn btn-block btn-danger" onClick={this.handleExitClick} id={listing.listingHash}><span className="ti-export"/> &nbsp;&nbsp;&nbsp;&nbsp;Exit Registry</a>
                                                  </div>
                                              }
                                          </div>
                                          {/*<div className="col-lg-6">
                                              <div><a href="#" className="btn btn-block btn-primary"  onClick={this.handleWithdrawUnstakedClick}><span className="ti-wallet" id={listing.listingHash}/>&nbsp;&nbsp;&nbsp;&nbsp;Withdraw</a></div>
                                          </div>*/}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )
          })}


          <WalletCard
            title="Wallet Balance"
            category="Account balances"
            color="warning"
            icon="ti-server"
          >
            <div className="numbers ">
              <div className="row text-muted">
                  <div className="col-lg-10">
                      {this.state.ethBalance}
                  </div>
                  <div className="col-lg-2">
                      ETH
                  </div>
              </div>
              <div className="row">
                  <div className="col-lg-10">
                      {this.state.balance}
                  </div>
                  <div className="col-lg-2">
                      MEDX
                  </div>
              </div>
            </div>
          </WalletCard>

          <WalletCard
            title="Voting Tokens"
            category="MEDX tokens to Vote"
            color="info"
            icon="ti-microphone"
          >
            <div className="numbers">
              {this.state.votingTokens} MEDX &nbsp;
              <span onClick={this.handleVotingTokensManageClick} className="icon-danger text-center"
                    style={{ cursor: 'pointer' }}>
                <i className="ti-settings btn btn-danger btn-lg"/>
              </span>
            </div>
          </WalletCard>

          <WalletCard
              title="Wallet Address"
              category="Address selected in your wallet or MetaMask"
              color="danger"
              icon="ti-wallet"
          >
              <p className="text-right">
                  {this.state.account}
              </p>
          </WalletCard>

        </div>

        <Modal
          show={this.state.showManageVotingTokensModal}
          dialogClassName="manage-wallet-modal">
          <Modal.Header>
            <h3>Manage Voting Tokens</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <WalletCard
                title="Add Tokens"
                category="Request voting rights"
                color="success"
                icon="ti-shopping-cart"
              >
                <div className="numbers">
                  <form onSubmit={this.handleAddVotingTokensSubmit}>
                    <div className="col-sm-8">
                      <input className="form-control" id="hash" onChange={this.updatedAddVotingTokens} required/>
                    </div>
                    <div className="col-sm-4">
                      <button type="submit" className="btn btn-fill btn-success"
                              disabled={this.state.submitInProgress}><i className="ti-plus"></i></button>
                    </div>
                  </form>
                </div>
              </WalletCard>

              <WalletCard
                title="Withdraw Tokens"
                category="Withdraw voting rights"
                color="danger"
                icon="ti-trash"
              >
                <div className="numbers">
                  <form onSubmit={this.handleWithdrawVotingTokensSubmit}>
                    <div className="col-sm-8">
                      <input className="form-control" id="withdraw" onChange={this.updatedWithdrawVotingTokens}
                             required/>
                    </div>
                    <div className="col-sm-4">
                      <button type="submit" className="btn btn-fill btn-danger"
                              disabled={this.state.submitInProgress}><i className="ti-minus"></i></button>
                    </div>
                  </form>
                </div>
              </WalletCard>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-default"
              onClick={this.handleCloseManageVotingTokensModal}
              type="button">
              Close
            </button>
          </Modal.Footer>
        </Modal>

        <GenericLoadingModal showModal={this.state.submitInProgress}/>
        <ErrorModal showModal={this.state.showErrorModal}/>
      </div>
    );
  }
}

export default Wallet;