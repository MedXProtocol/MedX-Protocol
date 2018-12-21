import React from 'react';
import { connect } from 'react-redux'

function mapDispatchToProps(dispatch) {
  return {
    dispatchShowBetaFaucetModal: () => {
      dispatch({ type: 'SHOW_BETA_FAUCET_MODAL', manuallyOpened: true })
    }
  }
}

export const BetaFeaturesLink = connect(null, mapDispatchToProps)(
  class _BetaFeaturesLink extends React.Component {

    openBetaFaucetModal = (e) => {
      e.preventDefault()

      this.props.dispatchShowBetaFaucetModal()
    }

    render () {
      return (
        <a href={null} onClick={this.openBetaFaucetModal}>
          <i className='ti-pulse' />
          <p>
            Beta Features
          </p>
        </a>
      )
    }
  }
)

export default BetaFeaturesLink;
