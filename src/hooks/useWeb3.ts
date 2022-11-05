import { useRef } from 'react';
import Web3 from 'web3';

const web3_ = new Web3();

const useWeb3 = () => {
  const web3 = useRef(web3_);
  return web3.current;
};

export default useWeb3;