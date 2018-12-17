export const accountBalances = function (state, { type, ethBalance, medXBalance }) {
  if (typeof state === 'undefined') {
    state = {
    }
  }

  switch(type) {
    case 'SET_ACCOUNT_BALANCE':
      state = {
        ...state,
        ethBalance,
        medXBalance
      }
      break

    // no default
  }

  return state
}
