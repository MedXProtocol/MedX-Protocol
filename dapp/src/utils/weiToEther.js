// import { getWeb3 } from '~/utils/getWeb3'
import Web3 from 'web3'
const web3 = new Web3()

export function weiToEther(amount) {
  // const web3 = getWeb3()
  // console.log('amount', amount)
  if (!amount) { return 0 }
  return web3.utils.fromWei(amount.toString(), 'ether')
}
