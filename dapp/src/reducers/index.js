import { combineReducers } from 'redux'
import { reducer as toastr } from 'react-redux-toastr'
import { betaFaucet } from './betaFaucetReducer'
import { accountBalances } from './accountBalancesReducer'

export default combineReducers({
  betaFaucet,
  accountBalances,
  toastr,
})
