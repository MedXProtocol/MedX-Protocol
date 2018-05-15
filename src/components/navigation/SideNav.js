import React from 'react';
import { NavLink } from 'react-router-dom';

import { sideNavRoutes } from '../../router';
import logo from '../../img/logo.png';

const SideNav = () => (
  <div className="sidebar" data-background-color="medcredits" data-active-color="danger">
    <div className="logo">
      <a className="simple-text logo-normal">
        <img src={logo} alt="MedCredits"/>
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
    </div>
  </div>
);

export default SideNav;