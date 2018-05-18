import React from 'react';

import AppBar from './AppBar';

const networkColor = {
  1: '#006f71',
  3: '#8e3519',
  4: '#af7c2c',
  42: '#543aa8',
  defaultColor: '#3b3b3c',
};

const networkBg = {
  1: '#00d6d8',
  3: '#fd8f63',
  4: '#fee191',
  42: '#b083ff',
  defaultColor: '#a8a8a9',
};

class MainPanel extends React.Component {
  getNetworkStyle(networkId) {
    return {
      textAlign: 'center',
      cursor: 'pointer',
      color: networkColor[networkId] || networkColor.defaultColor,
      backgroundColor: networkBg[networkId] || networkBg.defaultColor,
      padding: '14px'
    }
  }

  render () {
    return (
      <div className="main-panel">
        <div style={this.getNetworkStyle(this.props.networkId)}>
          You are currently connected to <b>{this.props.networkName}</b> network.
        </div>
        <AppBar title={this.props.pageTitle}/>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                {
                  this.props.children
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainPanel;