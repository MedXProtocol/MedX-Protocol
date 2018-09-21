import React from 'react';

class RegistryView extends React.Component {
  constructor(props) {
    super(props);
    this.status = "Registered";
    this.title = "ImaTitle";
    this.name = "ImaName";
    this.email = "ImaEmail";
    this.country = "ImaCountry";
    this.proof = "ImaProof";
  }

  render() {
    return (
      <div className='profile-container'>
        <div className='left-column'>
          <span>Result Details</span>
          <p>ID: {this.props.match.params.id}</p>
          <p>Status: {this.status}</p>
          <p>Title<span>{this.title}</span></p>
          <p>Name<span>{this.name}</span></p>
          <p>Email Address<span>{this.email}</span></p>
          <p>Country<span>{this.country}</span></p>
          <p>Proof of Qualification<span>{this.proof}</span></p>
        </div>
        <div className='right-column'>
          <div>Deposit Amount: $1 bajillion</div>
          <img alt="placeholder" src="http://via.placeholder.com/400x500" />
        </div>
      </div>
    );
  }
}

export default RegistryView;
