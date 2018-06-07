import React from 'react';

const WalletCard = ({
                        className,
                      title,
                      category,
                      icon,
                      color,
                      children
                    }) => (
  <div className={className === undefined ? "col-lg-6 col-md-12" : className}>
    <div className="card card-wallet card-account-address" style={{minHeight: 245}}>
      <div className="card-header">
        <div className="row">
          <div className="col-xs-2">
            <div className={`icon-big icon-${color} text-center`}>
              <i className={icon}/>
            </div>
          </div>
          <div className="col-xs-10 text-right">
            <h4 className="card-title">{title}</h4>
            <p className="category">{category}</p>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="row">
          <div className="col-xs-12">
              <br />
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default WalletCard;