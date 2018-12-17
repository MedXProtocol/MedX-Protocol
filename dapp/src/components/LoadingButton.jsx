import React from 'react'
import classnames from 'classnames'
import { LoadingLines } from '~/components/LoadingLines'

export const LoadingButton = props => (
  <button
    onClick={props.handleClick ? props.handleClick : null}
    type="submit"
    className={classnames(
      'btn',
      props.className || 'btn-primary',
      {
        'is-small': props.isSmall
      }
    )}
    disabled={props.disabled || props.isLoading}
  >
    {
      props.isLoading ? (
        <React.Fragment>
          {props.loadingText} <LoadingLines visible={true} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {props.initialText}
        </React.Fragment>
      )
    }
  </button>
)
