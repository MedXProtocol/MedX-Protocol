import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Route, HashRouter } from 'react-router-dom';

import SideNav from './components/navigation/SideNav';
import MainPanel from './components/navigation/MainPanel';

import { appRoutes } from './router';

import getWeb3 from './utils/getWeb3';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './css/themify-icons.css';
import './sass/paper-dashboard/paper-dashboard.css';
import './App.css';

class App extends Component {
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
          render={() => <Component {...route.props} parentCallback={this.handlePageTitleChange}/>}/>
      );
    });
  }

  render () {
    return (
      <HashRouter>
        <div className="wrapper">
          <SideNav/>
          <MainPanel
            networkName={this.state.networkName}
            networkId={this.state.networkId}
            pageTitle={this.state.pageTitle}>
            {
              this.buildAppRoutes()
            }
          </MainPanel>

          <Modal show={this.state.showNoAccountModal}>
            <Modal.Body>
              <div className="row">
                <div className="col text-center">
                  <h4>Please select an account</h4>
                  <p>It seems that you don't have an ETH account selected. If using MetaMask, please make sure that your
                    wallet is unlocked and that you have at least one account in your accounts list.</p>
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


export default App;
