import React, { Component } from 'react'
import ReactTimeout from 'react-timeout'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { toastr } from '~/toastr'
import { EthAddress } from '~/components/EthAddress'
// import { EtherFlip } from '~/components/EtherFlip'
import { LoadingButton } from '~/components/LoadingButton'
import { axiosInstance } from '~/../config/axiosConfig'

export const EthFaucetAPI = ReactTimeout(
  class _EthFaucetAPI extends Component {

    faucetLambdaURI = `${process.env.REACT_APP_LAMBDA_BETA_FAUCET_ENDPOINT_URI}/betaFaucetSendEther`

    constructor(props) {
      super(props)

      this.state = {
        isSending: false
      }
    }

    handleSendEther = (event) => {
      event.preventDefault()
      this.setState({
        isSending: true
      }, this.doSendEther)
    }

    englishErrorMessage = (message) => {
      return 'There was an error (you may have been sent this previously). If the problem persists please contact MedX Protocol on Telegram'
    }

    showToastrError = (message) => {
      toastr.error(this.englishErrorMessage(message),
        {
          url: 'https://t.me/MedXProtocol',
          text: 'Contact Support'
        }
      )
    }

    doSendEther = async () => {
      try {
        const response = await axiosInstance.get(`${this.faucetLambdaURI}?ethAddress=${this.props.address}`)

        const txId = this.props.sendExternalTransaction('sendEther')

        if (response.status === 200) {
          this.setState({
            txHash: response.data.txHash
          })

          toastr.success("We're sending you Ether - It will take a few moments to arrive.")

          this.props.dispatchSagaGenesisTxHash(txId, response.data.txHash)

          this.props.setTimeout(() => {
            this.props.handleMoveToNextStep()
          }, 2000)
        } else {
          this.showToastrError(response.data)

          this.props.setTimeout(() => {
            this.setState({
              isSending: false
            })
          }, 1000)
        }
      } catch (error) {
        this.showToastrError(error.message)

        this.props.setTimeout(() => {
          this.setState({
            isSending: false
          })
        }, 1000)
      }
    }

    render () {
      const { isSending } = this.state

      return (
        <div>
          <h3 className="is-size-5">
            Current Ether Balance:
            &nbsp; {this.props.ethBalance} {/*<EtherFlip wei={this.props.ethBalance} />*/}
          </h3>
          <p>
            <span className="eth-address has-text-grey-light">For address:&nbsp;
              <EthAddress address={this.props.address} />
            </span>
          </p>
          <br />
          <h4>
            You're low on Ether
            <br />
            <br />
            <span className="is-size-7 has-text-grey-light">
              Not to worry! We can have some sent to your account:
            </span>
          </h4>
          <p>
            <br />
            <LoadingButton
              handleClick={this.handleSendEther}
              initialText='Send Me Ether'
              loadingText='Sending'
              isLoading={isSending}
            />
          </p>
          <br />
          <p>
            <button
              onClick={this.props.handleMoveToNextStep}
              className="btn btn-light btn-text btn-small"
            >skip this for now</button>
          </p>
        </div>
      )
    }
  }
)
