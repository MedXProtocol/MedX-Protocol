import React from 'react';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom';

import { sideNavRoutes } from '../../router/index';
import medXProtocolLogoImg from '~/assets/img/medx-protocol-logo.png'
import medXProtocolLogoImg2x from '~/assets/img/medx-protocol-logo@2x.png'

function mapDispatchToProps(dispatch) {
  return {
    dispatchShowBetaFaucetModal: () => {
      dispatch({ type: 'SHOW_BETA_FAUCET_MODAL', manuallyOpened: true })
    }
  }
}

export const SideNav = connect(null, mapDispatchToProps)(
  class _SideNav extends React.Component {

    openBetaFaucetModal = (e) => {
      e.preventDefault()

      this.props.dispatchShowBetaFaucetModal()
    }

    render () {
      return (
        <div className="sidebar" data-background-color="medcredits" data-active-color="danger">
          <div className="logo">
            <a className="simple-text logo-normal">
              <img
                src={medXProtocolLogoImg}
                alt="MedX Protocol Logo"
                srcSet={`${medXProtocolLogoImg} 1x, ${medXProtocolLogoImg2x} 2x`}
              />
            </a>
          </div>
          <div className="sidebar-wrapper">
            <ul className="nav">
              {
                sideNavRoutes.map(route =>
                  <li key={route.path}>
                    <NavLink to={route.path}>
                      <i className={route.icon}/>
                      <p>
                        {route.title}
                      </p>
                    </NavLink>
                  </li>
                )
              }
            </ul>

            <ul className="nav">
              <li key={'beta-features'}>
                <a href={null} onClick={this.openBetaFaucetModal}>
                  <i className='ti-pulse' />
                  <p>
                    Beta Features
                  </p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  }
)

export default SideNav;
