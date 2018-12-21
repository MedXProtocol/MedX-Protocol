import React from 'react';
import { NavLink } from 'react-router-dom';

import { sideNavRoutes } from '../../router/index';
import medXProtocolLogoImg from '~/assets/img/medx-protocol-logo.png'
import medXProtocolLogoImg2x from '~/assets/img/medx-protocol-logo@2x.png'
import BetaFeaturesLink from '~/components/navigation/BetaFeaturesLink'

export const SideNav = function () {
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
                <NavLink to={route.path} activeClassName='active'>
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
            <BetaFeaturesLink />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SideNav;
