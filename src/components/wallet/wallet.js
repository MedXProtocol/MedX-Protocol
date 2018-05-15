import React, { Component } from 'react';
import {
  getSelectedAccountBalance,
  getSelectedAccount,
  getVotingTokensBalance,
  requestVotingRights,
  withdrawVotingRights
} from '../../utils/web3-util';
import { Modal } from 'react-bootstrap';

import WalletCard from './WalletCard';

import GenericLoadingModal from '../modals/GenericLoadingModal';
import ErrorModal from '../modals/ErrorModal';
import './wallet.css';

export class Wallet extends Component {
  constructor () {
    super();

    this.state = {
      balance: '0',
      selectedAccount: '0',
      votingTokens: '0',
      addVotingTokens: '0',
      withdrawVotingTokens: '0',
      submitInProgress: false,
      showManageVotingTokensModal: false,
      showErrorModal: false
    };
  }

  componentDidMount = async () => {
    this.props.parentCallback('My Account');

    const accountBalance = await getSelectedAccountBalance();
    const selectedAccount = await getSelectedAccount();
    const votingTokens = await getVotingTokensBalance();


    this.setState({
      balance: accountBalance.toFixed(3),
      account: selectedAccount,
      votingTokens: votingTokens.toFixed(3)
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
        const newVoteTokenBalance = parseInt(this.state.votingTokens) + parseInt(this.state.addVotingTokens);
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
        const newVoteTokenBalance = parseInt(this.state.votingTokens) - parseInt(this.state.withdrawVotingTokens);
        this.onSuccess(newVoteTokenBalance);
      } else {
        this.onError();
      }
    });
  };

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

          <WalletCard
            title="Wallet Balance"
            category="MEDX token balance"
            color="warning"
            icon="ti-server"
          >
            <div className="numbers">
              {this.state.balance} MEDX
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