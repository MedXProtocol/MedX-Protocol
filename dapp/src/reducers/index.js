import { combineReducers } from 'redux'
import { reducer as toastr } from 'react-redux-toastr'
import { betaFaucet } from './betaFaucetReducer'
import { accounts } from './accountsReducer'

export default combineReducers({
  betaFaucet,
  accounts,
  toastr,
})
