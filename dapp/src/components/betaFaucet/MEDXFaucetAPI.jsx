import React, { Component } from 'react'
import ReactTimeout from 'react-timeout'
import PropTypes from 'prop-types'
import { toastr } from '~/toastr'
import { EthAddress } from '~/components/EthAddress'
import { MEDX } from '~/components/MEDX'
import { LoadingButton } from '~/components/LoadingButton'
import { axiosInstance } from '~/../config/axiosConfig'
import MEDXCoinImg from '~/assets/img/medx-logo.png'
import MEDXCoinImg2x from '~/assets/img/medx-logo@2x.png'

export const MEDXFaucetAPI = ReactTimeout(
  class _MEDXFaucetAPI extends Component {

    faucetLambdaURI = `${process.env.REACT_APP_LAMBDA_BETA_FAUCET_ENDPOINT_URI}/betaFaucetSendMEDX`

    constructor(props) {
      super(props)

      this.state = {
        isSending: false
      }
    }

    handleMintMEDX = (event) => {
      event.preventDefault()
      this.setState({
        isSending: true
      }, this.doMintMEDX)
    }

    englishErrorMessage = (message) => {
      return 'There was an error (you may have been sent this previously). If the problem persists please contact MedX Protocol on Telegram'
    }

    showToastrError = (message) => {
      toastr.error(this.englishErrorMessage(message),
        {
          url: 'https://t.me/MedXProtocol',
          medXt: 'Contact Support'
        }
      )
    }

    doMintMEDX = async () => {
      try {
        const response = await axiosInstance.get(`${this.faucetLambdaURI}?ethAddress=${this.props.address}`)

        const txId = this.props.sendExternalTransaction('sendMEDX')

        if (response.status === 200) {
          this.setState({
            txHash: response.data.txHash
          })

          toastr.success("We're sending you MEDX. It will take a few moments to arrive.")

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
          <img
            src={MEDXCoinImg2x}
            alt="MEDX Token Icon"
          />

          <h3 className="is-size-5">
            Current Balance: {this.props.medXBalance}
          </h3>
          <p>
            <span className="eth-address has-text-grey-light">For address:&nbsp;
              <EthAddress address={this.props.address} />
            </span>
          </p>
          <br />
          <h4 className="is-size-5">
            You're low on MEDX
            <br />
            <br />
            <span className="is-size-7 has-medXt-grey-light">
              MEDX is necessary for staking a deposit and submitting tokens. We can send some to you now:
            </span>
          </h4>

          <p>
            <br />

            <LoadingButton
              handleClick={this.handleMintMEDX}
              initialText='Send Me MEDX'
              loadingText='Sending'
              isLoading={isSending}
            />
          </p>
          <br />
          <p>
            <button
              onClick={this.props.handleMoveToNextStep}
              className="btn btn-light btn-text btn-size-7"
            >skip this for now</button>
          </p>
        </div>
      )
    }
  }
)
