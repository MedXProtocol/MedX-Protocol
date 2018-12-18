import React, { Component } from 'react';
import { Modal } from "react-bootstrap";

import ReactTimeout from 'react-timeout'
import { defined } from '~/utils/defined'

const ACTIVATE_DURATION = 2000

export const LoginToMetaMaskModal = ReactTimeout(
  class _LoginToMetaMaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          showModal: props.showModal,
          enoughTimePassed: false,
          error: '',
          isUnlocked: undefined,
          isEnabled: undefined,
          isApproved: undefined
        };
    }

    componentDidMount() {
      // check to see if we need to authorize metamask
      this.props.setTimeout(
          () => {
            this.interval = this.props.setInterval(this.checkEthereum, 1000)

            this.setState({
              enoughTimePassed: true
            }, this.determineModalState)
          },
          ACTIVATE_DURATION
        )
    }

    handleErrorOKClickModal = (e) => {
        this.setState({showModal: false});
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.showModal !== this.state.showModal) {
          this.setState({ showModal: nextProps.showModal })
      }

      this.determineModalState(nextProps)
    }

    componentWillUnmount() {
      this.clearInterval()
    }

    determineModalState(nextProps) {
      let newModalState = false
      let props = nextProps ? nextProps : this.props

      if (this.state.enoughTimePassed && !!window.web3 && !defined(props.address)) {
        newModalState = true
      }

      this.setState({
        showNoAccountModal: newModalState
      }, () => {
        if (!this.state.showNoAccountModal) {
          this.clearInterval()
        }
      })
    }

    clearInterval = () => {
      this.props.clearInterval(this.interval)
    }

    enableEthereum = async (e) => {
      e.preventDefault()

      this.setState({ error: '' })

      if (window.ethereum) {
        try {
          await window.ethereum.enable()
        } catch (error) {
          if (error !== 'User rejected provider access') {
            console.error(error)
          }

          this.setState({ error: error })
        }
      }
    }

    checkEthereum = async () => {
      if (window.ethereum) {
        let isUnlocked,
          isEnabled,
          isApproved

        if (window.ethereum._metamask) {
          isUnlocked = await window.ethereum._metamask.isUnlocked()
          isEnabled  = await window.ethereum._metamask.isEnabled()
          isApproved = await window.ethereum._metamask.isApproved()
        }

        // hack due to a MetaMask bug that shows up when you Quit Chrome and re-open Chrome
        // right back to the tab using MetaMask
        if ((isUnlocked && isApproved) && !defined(this.props.address)) {
          window.location.reload(true)
        }

        this.setState({
          isUnlocked,
          isEnabled,
          isApproved
        })
      }
    }

    render() {
        return (
            <Modal show={this.state.showModal}>

                <Modal.Header>
                    <h3 className="text-center">No Account Selected</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                  <br />
                                    <span className="ti-lock" style={{fontSize: '46pt'}}>&nbsp;</span>
                                    <br />
                                    <br />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-1">&nbsp;</div>
                                <div className="col-xs-10 text-center">


                                  It seems that you don't have an ETH account selected.

                                  <br />If using MetaMask, please make sure that your wallet is unlocked, that you have at least one account in your accounts list and that you've authorized the TCR.

                                  {this.state.isUnlocked && !this.state.isApproved
                                    ? (
                                      <div className="text-center">
                                        <br />
                                        <button className="btn btn-light btn-primary btn-outlined" onClick={this.enableEthereum}>
                                          Authorize The Token Registry DApp
                                        </button>
                                        <br />
                                        <br />

                                        {this.state.error ?
                                          (
                                            <p>
                                              Please authorize read-only access to your MetaMask accounts use The Token Registry.
                                              <br />
                                              <span className="has-text-grey-lighter">You will still need to manually sign transactions yourself.</span>
                                              {/*There was an error: {this.state.error}*/}
                                            </p>

                                          ) : null
                                        }
                                      </div>
                                    ) : null
                                  }

                                  {!this.state.isUnlocked
                                    ? (
                                      <h6 className="is-size-6">
                                        <br />
                                        <br />
                                        To continue click the fox in the top-right corner to log in to your MetaMask account.
                                      </h6>
                                    )
                                    : null
                                  }

                                </div>
                                <div className="col-xs-1">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="row">
                        <div className="col-lg-8">&nbsp;</div>
                        <div className="col-lg-3">
                        </div>
                        <div className="col-lg-1">&nbsp;</div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
  }
)
