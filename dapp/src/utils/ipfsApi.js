import IpfsApi from 'ipfs-api';

export const hostname = process.env.REACT_APP_IPFS_HOSTNAME || 'ipfs.medcredits.io'
export const apiPort = process.env.REACT_APP_IPFS_API_PORT || '5001'
export const gatewayPort = process.env.REACT_APP_IPFS_GATEWAY_PORT || '8080'
export const protocol = process.env.REACT_APP_IPFS_PROTOCOL || 'https'

export const ipfsApi = IpfsApi(
  hostname,
  apiPort,
  { protocol }
)
