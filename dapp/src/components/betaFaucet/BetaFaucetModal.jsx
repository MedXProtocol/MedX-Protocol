import React, { Component } from 'react'
import ReactCSSTransitionReplace from 'react-css-transition-replace'
import { Modal } from "react-bootstrap"
import { connect } from 'react-redux'
// import { transactionFinders } from '~/finders/transactionFinders'
import { get } from 'lodash'
import { MEDXFaucetAPI } from '~/components/betaFaucet/MEDXFaucetAPI'
import { EthFaucetAPI } from '~/components/betaFaucet/EthFaucetAPI'
import { defined } from '~/utils/defined'
import { weiToEther } from '~/utils/weiToEther'

function mapStateToProps (state) {
  // const address = get(state, 'sagaGenesis.accounts[0]')

  // const workTokenAddress = contractByName(state, 'WorkToken')
  // const medXBalance = cacheCallValueBigNumber(state, workTokenAddress, 'balanceOf', address)
  // const ethBalance = get(state, 'sagaGenesis.ethBalance.balance')
  const betaFaucetModalDismissed = get(state, 'betaFaucet.betaFaucetModalDismissed')
  const step = get(state, 'betaFaucet.step')
  const manuallyOpened = get(state, 'betaFaucet.manuallyOpened')
  // const betaFaucetAddress = contractByName(state, 'BetaFaucet')
  // const hasBeenSentEther = cacheCallValue(state, betaFaucetAddress, 'sentEtherAddresses', address)

  // const sendEtherTx = transactionFinders.findByMethodName(state, 'sendEther')
  // const sendMEDXTx = transactionFinders.findByMethodName(state, 'sendMEDX')

  // const etherWasDripped = sendEtherTx && (sendEtherTx.inFlight || sendEtherTx.confirmed)
  // const medXWasMinted = sendMEDXTx && (sendMEDXTx.inFlight || sendMEDXTx.confirmed)

  // const needsEth = (weiToEther(ethBalance) < 0.1 && !hasBeenSentEther)
  // const needsMEDX = (weiToEther(medXBalance) < 100)

  // const showBetaFaucetModal =
  //   !betaFaucetModalDismissed &&
  //   (
  //     defined(workTokenAddress) && defined(betaFaucetAddress) &&
  //     defined(ethBalance) && defined(medXBalance)
  //   ) &&
  //   (needsEth || needsMEDX || manuallyOpened)

  return {
    // address,
    // betaFaucetAddress,
    step,
    // showBetaFaucetModal,
    // needsEth,
    // needsMEDX,
    // ethBalance,
    // workTokenAddress,
    // medXBalance,
    // hasBeenSentEther,
    // etherWasDripped,
    // medXWasMinted,
    manuallyOpened
  }
}
//
// function* betaFaucetModalSaga({ workTokenAddress, betaFaucetAddress, address }) {
//   if (!workTokenAddress || !betaFaucetAddress || !address) { return }
//
//   yield all([
//     cacheCall(workTokenAddress, 'balanceOf', address),
//     cacheCall(betaFaucetAddress, 'sentEtherAddresses', address),
//     cacheCall(betaFaucetAddress, 'sentMEDXAddresses', address)
//   ])
// }

function mapDispatchToProps(dispatch) {
  return {
    dispatchHideModal: () => {
      dispatch({ type: 'HIDE_BETA_FAUCET_MODAL' })
    },
    dispatchSetBetaFaucetModalStep: (step) => {
      dispatch({ type: 'SET_BETA_FAUCET_MODAL_STEP', step })
    },
    dispatchSagaGenesisStartTx: (transactionId, txType, call) => {
      dispatch({ type: 'SG_START_TRANSACTION', transactionId, txType, call })
    },
    dispatchSagaGenesisTxHash: (transactionId, txHash) => {
      dispatch({ type: 'SG_TRANSACTION_HASH', transactionId, txHash })
    }
  }
}

export const BetaFaucetModal = connect(mapStateToProps, mapDispatchToProps)(
  class _BetaFaucetModal extends Component {

    componentWillReceiveProps(nextProps) {
      if (!nextProps.needsEth && nextProps.step === 1) {
        const nextStepNum = this.nextStep(nextProps.step + 1, nextProps)
        this.props.dispatchSetBetaFaucetModalStep(nextStepNum)
      }
    }

    nextStep = (step, props) => {
      if (!step) {
        step = 1
      }

      if (step === 1 && (!props.needsEth || props.etherWasDripped)) {
        step = 2
      }

      if (step === 2 && (!props.needsMEDX)) {
        step = -1
      }

      if (step === 3) {
        step = -1
      }

      return step
    }

    sendExternalTransaction = (txType) => {
      let txId
      // const txId = nextId()

      const call = {
        method: txType,
        address: '0x0444d61FE60A855d6f40C21f167B643fD5F17aF3' // junk address for cache invalidator to be happy
      }

      this.props.dispatchSagaGenesisStartTx(txId, txType, call)

      return txId
    }

    closeModal = (e) => {
      if (e) {
        e.preventDefault()
      }
      this.props.dispatchHideModal()
    }

    handleMoveToNextStep = (e) => {
      if (e) {
        e.preventDefault()
        e.persist()
      }

      const nextStepNum = this.nextStep(this.props.step + 1, this.props)
      this.props.dispatchSetBetaFaucetModalStep(nextStepNum)

      if (nextStepNum === -1 || nextStepNum === 3) {
        this.closeModal(e)
      }
    }

    render() {
      let content,
        stepText

      let totalSteps = 2

      const {
        ethBalance,
        medXBalance,
        address,
        step
      } = this.props

      if (!this.props.showBetaFaucetModal) { return null }

      if (step === 1) {
        content = <EthFaucetAPI
          key="ethFaucet"
          address={address}
          ethBalance={ethBalance}
          handleMoveToNextStep={this.handleMoveToNextStep}
          sendExternalTransaction={this.sendExternalTransaction}
          dispatchSagaGenesisTxHash={this.props.dispatchSagaGenesisTxHash}
        />
      } else if (step === 2) {
        content = <MEDXFaucetAPI
          key='medXFaucet'
          address={address}
          medXBalance={medXBalance}
          handleMoveToNextStep={this.handleMoveToNextStep}
          sendExternalTransaction={this.sendExternalTransaction}
          dispatchSagaGenesisTxHash={this.props.dispatchSagaGenesisTxHash}
        />
      }

      if (step > 0) {
        stepText = (
          <React.Fragment>
            &nbsp;<small>(Step {step} of {totalSteps})</small>
          </React.Fragment>
        )
      }

      return (
        <Modal show={this.props.showBetaFaucetModal} onHide={this.closeModal}>
          <Modal.Header>
            <div className="row">
              <div className="col-xs-12 text-center">
                <h4>
                  Welcome to the MedX Protocol TCR Beta
                  <br className="visible-xs hidden-sm hidden-md hidden-lg" />
                  {stepText}
                </h4>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body className="modal__beta-faucet">
            <div className="row">
              <ReactCSSTransitionReplace transitionName="page"
                                         transitionEnterTimeout={400}
                                         transitionLeaveTimeout={400}>
                {content}
              </ReactCSSTransitionReplace>
            </div>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      );
    }
  }
)
