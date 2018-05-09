import React, {Component} from 'react';
import {
    getSelectedAccountBalance,
    getSelectedAccount,
    getVotingTokensBalance,
    requestVotingRights,
    withdrawVotingRights
} from '../../utils/web3-util';
import {Modal} from "react-bootstrap";
import TxMiningModal from "../modals/TxMiningModal";
import ErrorModal from "../modals/ErrorModal";
import './wallet.css'

export class Wallet extends Component {
    constructor(){
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
        const accountBalance = await getSelectedAccountBalance();
        const selectedAccount = await getSelectedAccount();
        const votingTokens = await getVotingTokensBalance();

        this.props.parentCallback("My Account");

        this.setState({
            balance: accountBalance.toFixed(3),
            account: selectedAccount,
            votingTokens: votingTokens.toFixed(3)
        });
    };

    handleAddVotingTokensSubmit = (event) =>  {
        event.preventDefault();
        this.addVotingTokens();
    };

    handleWithdrawVotingTokensSubmit = (event) =>  {
        event.preventDefault();
        this.withdrawVotingTokens();
    };

    handleVotingTokensManageClick = (event) =>  {
        this.setState({showManageVotingTokensModal: true});
    };

    handleCloseManageVotingTokensModal = (event) =>  {
        this.setState({showManageVotingTokensModal: false});
    };

    addVotingTokens = async () => {
        this.setState({submitInProgress: true, showManageVotingTokensModal: false});
        await requestVotingRights(this.state.addVotingTokens, (error, result) => {
            if (!error) {
                const newVoteTokenBalance = parseInt(this.state.votingTokens) + parseInt(this.state.addVotingTokens);
                this.setState({votingTokens: newVoteTokenBalance.toFixed(3)});
                this.onSuccess();
            } else {
                this.onError();
            }
        });
    };

    withdrawVotingTokens = async () => {
        this.setState({submitInProgress: true, showManageVotingTokensModal: false});
        await withdrawVotingRights(this.state.withdrawVotingTokens, (error, result) => {
            if (!error) {
                const newVoteTokenBalance = parseInt(this.state.votingTokens) - parseInt(this.state.withdrawVotingTokens);
                this.setState({votingTokens: newVoteTokenBalance.toFixed(3)});
                this.onSuccess();
            } else {
                this.onError();
            }
        });
    };


    updatedAddVotingTokens = (event) => {
        this.setState({addVotingTokens: event.target.value});
    };

    updatedWithdrawVotingTokens = (event) => {
        this.setState({withdrawVotingTokens: event.target.value});
    };

    handleErrorOkClickModal = (event) => {
        event.preventDefault();
        this.setState({showErrorModal: false});
    };

    onSuccess = () => {
        getSelectedAccountBalance().then((_balance) => {
            this.setState({balance: _balance.toFixed(3)});
        });

        this.setState({submitInProgress: false});
    };

    onError = () => {
        this.setState({submitInProgress: false, showErrorModal: true});
    };

    render() {
        return (

            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div className="card card-wallet card-account-address">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-xs-2">
                                        <div className="icon-big icon-danger text-center">
                                            <i className="ti-wallet"></i>
                                        </div>
                                    </div>
                                    <div className="col-xs-10 text-right">
                                        <h4 className="card-title">Wallet Address</h4>
                                        <p className="category">Address selected in your wallet or MetaMask</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <p className="text-right">
                                            {this.state.account}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-6 col-md-12">
                        <div className="card card-wallet card-account-balance">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-xs-2">
                                        <div className="icon-big icon-warning text-center">
                                            <i className="ti-server"></i>
                                        </div>
                                    </div>
                                    <div className="col-xs-10 text-right">
                                        <h4 className="card-title">Wallet Balance</h4>
                                        <p className="category">MEDX token balance</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="numbers">
                                            {this.state.balance} MEDX
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div className="card card-wallet card-account-balance">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-xs-2">
                                        <div className="icon-big icon-info text-center">
                                            <i className="ti-microphone"></i>
                                        </div>
                                    </div>
                                    <div className="col-xs-10 text-right">
                                        <h4 className="card-title">Voting Tokens</h4>
                                        <p className="category">MEDX tokens to Vote</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="numbers">
                                            {this.state.votingTokens} MEDX &nbsp;
                                            <span onClick={this.handleVotingTokensManageClick} className="icon-danger text-center" style={{cursor:'pointer'}}>
                                                <i className="ti-settings btn btn-danger btn-lg"></i>
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal 
                    show={this.state.showManageVotingTokensModal}
                    dialogClassName="manage-wallet-modal">
                    <Modal.Header>
                        <h3>Manage Voting Tokens</h3>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <div className="card card-account-balance">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-xs-2">
                                                <div className="icon-big icon-success text-center">
                                                    <i className="ti-shopping-cart"></i>
                                                </div>
                                            </div>
                                            <div className="col-xs-10 text-right">
                                                <h5 className="card-title">Add Tokens</h5>
                                                <p className="category">Request voting rights</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <div className="row form-group">
                                            <div className="col-xs-12">
                                                <form onSubmit={this.handleAddVotingTokensSubmit}>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" id="hash" onChange={this.updatedAddVotingTokens} required/>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <button type="submit" className="btn btn-fill btn-success" disabled={this.state.submitInProgress}><i className="ti-plus"></i></button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="card card-account-balance">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-xs-2">
                                                <div className="icon-big icon-danger text-center">
                                                    <i className="ti-trash"></i>
                                                </div>
                                            </div>
                                            <div className="col-xs-10 text-right">
                                                <h5 className="card-title">Withdraw Tokens</h5>
                                                <p className="category">Withdraw voting rights</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <div className="row form-group">
                                            <div className="col-xs-12">
                                                <form onSubmit={this.handleWithdrawVotingTokensSubmit}>
                                                    <div className="col-sm-8">
                                                        <input className="form-control" id="withdraw" onChange={this.updatedWithdrawVotingTokens} required/>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <button type="submit" className="btn btn-fill btn-danger" disabled={this.state.submitInProgress}><i className="ti-minus"></i></button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.handleCloseManageVotingTokensModal} type="button" className="btn btn-default">Close</button>
                    </Modal.Footer>
                </Modal>

                <TxMiningModal showLoadingModal={this.state.submitInProgress} />
                <ErrorModal showModal={this.state.showErrorModal} closeHandler={this.handleErrorOkClickModal}/>
            </div>
        );
    }
}

export default Wallet;