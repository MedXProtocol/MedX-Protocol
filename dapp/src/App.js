import React, { Component } from 'react';
import {Route, Switch, HashRouter, Redirect} from 'react-router-dom';

import { store } from './store';

import { Provider } from 'react-redux';

import { BetaFaucetModal } from './components/betaFaucet/BetaFaucetModal'

import SideNav from './components/navigation/SideNav';
import MainPanel from './components/navigation/MainPanel';

import { appRoutes } from './router';

import getWeb3 from './utils/getWeb3';
import { LoginToMetaMaskModal } from "./components/modals/LoginToMetaMaskModal";

const App = class _App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      networkName: null,
      networkId: null,
      accounts: null,
      showNoAccountModal: false
    };

    this.buildAppRoutes = this.buildAppRoutes.bind(this);
    this.handleCloseNoAccountModal = this.handleCloseNoAccountModal.bind(this);
    this.handlePageTitleChange = this.handlePageTitleChange.bind(this);
  }

  componentDidMount () {
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
          this.setState({ showNoAccountModal: true });
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  handleCloseNoAccountModal () {
    this.setState({ showNoAccountModal: false });
  }

  handlePageTitleChange (pageTitle) {
    this.setState({ pageTitle });
  }

  buildAppRoutes () {
    return appRoutes.map(route => {
      const Component = route.component;
      return (
        <Route
          key={route.path}
          path={route.path}
          render={(props) => <Component {...props} parentCallback={this.handlePageTitleChange} /> }/>
      );
    });
  }

  render () {
    return (
      <Provider store={store}>
        <HashRouter>
          <div className="wrapper">
            <BetaFaucetModal />
            <SideNav />
            <MainPanel
              networkName={this.state.networkName}
              networkId={this.state.networkId}
              pageTitle={this.state.pageTitle}>
              <Switch>
                <Redirect exact from="/" to="/registry-application"/>
                {
                  this.buildAppRoutes()
                }
              </Switch>
            </MainPanel>

            {this.state.showNoAccountModal ? (
              <LoginToMetaMaskModal
                showModal={this.state.showNoAccountModal}
              />
            ) : null}
          </div>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
