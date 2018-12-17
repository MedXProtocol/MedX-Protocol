export const accounts = function (state, { type, address, ethBalance, medXBalance }) {
  if (typeof state === 'undefined') {
    state = {
    }
  }

  switch(type) {
    case 'UPDATE_ACCOUNT':
      state = {
        ...state,
        address,
        ethBalance,
        medXBalance
      }
      break

    // no default
  }

  return state
}
