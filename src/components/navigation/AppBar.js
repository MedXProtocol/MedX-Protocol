import React from 'react';
import { NavLink } from 'react-router-dom';

const AppBar = ({ title }) => (
  <nav id="mainNav" className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <div className="navbar-brand">
          <h4 style={{ marginTop: -5 }}>{title}</h4>
        </div>
      </div>
      <div className="collapse navbar-collapse">
        <ul className="nav navbar-nav navbar-right">
          <li>
            <NavLink to="/wallet" id="wallet-link" className="btn-magnify">
              <i className="ti-wallet"/>
              &nbsp; My Account
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default AppBar;