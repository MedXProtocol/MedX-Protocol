import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";

// add components
import {Registry} from './components/registry/registry.js'
import {Wallet} from './components/wallet/wallet.js'
import {RegistryApplication} from './components/registry/application.js'
import RegistryVoting from './components/registry/voting.js'
import RegistryRevealing from './components/registry/revealing.js'
import { RegistryView } from './components/registry/registry-view.jsx'
import { VotingView } from './components/registry/voting-view.jsx'
import { ChallengeView } from './components/registry/challenge-view.jsx'
import Apply from './components/apply/apply.js'
import Search from './components/search/search.js'

import getWeb3 from './utils/getWeb3'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './css/themify-icons.css';
import './sass/paper-dashboard/paper-dashboard.css'
import './App.css'

import logo from './img/logo.png';

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            storageValue: 0,
            web3: null,
            // states of side bar
            activeApply: false,
            activeRegistry: true,
            activeChallenge: false,
            activeVote: false,

            activeOpacity: false,

            showNoAccountModal: false
        }

        this.mountNavClick = this.mountNavClick.bind(this);
        this.getClasses = this.getClasses.bind(this);
        this.handleCloseNoAccountModal = this.handleCloseNoAccountModal.bind(this);
        this.handlePageTitleChange = this.handlePageTitleChange.bind(this);
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3,
                    networkName: results.networkName,
                    networkId: results.networkId,
                    accounts: results.accounts
                });

                if (results.accounts === 0)
                    this.setState({showNoAccountModal: true});
            })
            .catch(() => {
                console.log('Error finding web3.')
            });
    }

    mountNavClick(e) {
        //this.setState({activeOpacity: false});
        //this.setState({activeApp: false, activeVot: false, activeRet: false});

        if (e.currentTarget.id === '1')
            this.setState({activeApply: true, activeRegistry: false, activeChallenge: false, activeVote: false});
        else if (e.currentTarget.id === '2')
            this.setState({activeApply: false, activeRegistry: true, activeChallenge: false, activeVote: false});
        else if (e.currentTarget.id === '3')
            this.setState({activeApply: false, activeRegistry: false, activeChallenge: true, activeVote: false});
        else if (e.currentTarget.id === '4')
            this.setState({activeApply: false, activeRegistry: false, activeChallenge: false, activeVote: true});
    }

    getClasses() {
    }

    getNetworkStyle() {
        let networkColor, networkBg;
        switch (this.state.networkId) {
            case 1:
                networkColor = '#006f71';
                networkBg = '#00d6d8';
                break;
            case 3:
                networkColor = '#8e3519';
                networkBg = '#fd8f63';
                break;
            case 4:
                networkColor = '#af7c2c';
                networkBg = '#fee191';
                break;
            case 42:
                networkColor = '#543aa8';
                networkBg = '#b083ff';
                break;
            default:
                networkColor = '#3b3b3c';
                networkBg = '#a8a8a9';
        }

        return {
            textAlign: 'center',
            cursor: 'pointer',
            color: networkColor,
            backgroundColor: networkBg,
            padding: '14px'
        }
    }

    handleCloseNoAccountModal() {
        this.setState({showNoAccountModal: false});
    }

    handlePageTitleChange(_title) {
        this.setState({ pageTitle: _title });
    }

    render() {
        return (
            <HashRouter>
                <div className="wrapper">
                    <div className="sidebar" data-background-color="medcredits" data-active-color="danger">
                        <div className="logo">
                            <a className="simple-text logo-normal">
                                <img src={logo} alt="MedCredits"></img>
                            </a>
                        </div>
                        <div className="sidebar-wrapper">
                            <ul className="nav">
                                <li>&nbsp;</li>
                                <li>&nbsp;</li>
                                <li id="1" onClick={this.mountNavClick} className={this.state.activeApply ? 'active' : null}>
                                    <NavLink to="/apply">
                                        <i className="ti-pencil-alt"></i>
                                        <p>
                                            APPLY
                                        </p>
                                    </NavLink>
                                </li>

                                <li>&nbsp;</li>

                                <li id="2" onClick={this.mountNavClick} className={this.state.activeRegistry ? 'active' : null}>
                                    <NavLink to="/registry-application">
                                        <i className="ti-agenda"></i>
                                        <p>
                                            PHYSICIAN REGISTRY
                                        </p>
                                    </NavLink>
                                </li>
                                <li id="3" onClick={this.mountNavClick} className={this.state.activeChallenge ? 'active' : null}>
                                    <NavLink to="/registry-voting">
                                        <i className="ti-unlink"></i>
                                        <p>
                                            CHALLENGES
                                        </p>
                                    </NavLink>
                                </li>

                                <li id="4" onClick={this.mountNavClick} className={this.state.activeVote ? 'active' : null}>
                                    <NavLink to="/registry-revealing">
                                        <i className="ti-stats-up"></i>
                                        <p>
                                            VOTES
                                        </p>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="main-panel">
                        <div style={this.getNetworkStyle()}>
                            You are currently connected to <b>{this.state.networkName}</b> network.
                        </div>

                        <nav id="mainNav" className="navbar navbar-default">
                            <div className="container-fluid">
                                <div className="navbar-header">
                                    <div className="navbar-brand">
                                        <h4 style={{marginTop: -5}}>{this.state.pageTitle}</h4>
                                    </div>
                                </div>
                                <div className="collapse navbar-collapse">
                                    <ul className="nav navbar-nav navbar-right">
                                        <li>
                                            <a id="wallet-link" className="btn-magnify" href="">
                                                <NavLink to="/wallet">
                                                    <i className="ti-wallet"></i>
                                                    &nbsp; My Account
                                                </NavLink>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <Route path="/registry" component={Registry}/>
                                        <Route path="/apply" render={(props) => <Apply {...props} parentCallback={this.handlePageTitleChange} />} />
                                        <Route path="/search" render={(props) => <Search {...props} parentCallback={this.handlePageTitleChange} />} />
                                        <Route path="/registry-application" render={(props) => <RegistryApplication {...props} parentCallback={this.handlePageTitleChange} />} />
                                        <Route path="/registry-voting" render={(props) => <RegistryVoting {...props} parentCallback={this.handlePageTitleChange} />} />
                                        <Route path="/registry-revealing" render={(props) => <RegistryRevealing {...props} parentCallback={this.handlePageTitleChange} />} />
                                        <Route path="/registry-view/:id" render={(props) => <RegistryView {...props} parentCallback={this.handlePageTitleChange} />} />
                                        <Route path="/voting-view/:id" render={(props) => <VotingView {...props} parentCallback={this.handlePageTitleChange} />} />
                                        <Route path="/challenge-view/:id" render={(props) => <ChallengeView {...props} parentCallback={this.handlePageTitleChange} />} />
                                        <Route path='/wallet' render={(props) => <Wallet {...props} parentCallback={this.handlePageTitleChange} />} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal show={this.state.showNoAccountModal}>
                        <Modal.Body>
                            <div className="row">
                                <div className="col text-center">
                                    <h4>Please select an account</h4>
                                    <p>It seems that you don't have an ETH account selected. If using MetaMask, please make sure that your wallet is unlocked and that you have at least one account in your accounts list.</p>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={this.handleCloseNoAccountModal} type="button" className="btn btn-default">Close</button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </HashRouter>

        );
    }
}


export default App
