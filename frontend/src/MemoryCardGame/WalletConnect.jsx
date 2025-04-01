import React, { useState } from 'react';
import styles from './WalletConnect.module.css';

const WalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setError('');
      } else {
        setError('MetaMask is not installed');
      }
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.connectButton} onClick={connectWallet}>
        Connect MetaMask Wallet
      </button>
      {walletAddress && (
        <div className={styles.address}>
          Connected Wallet: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default WalletConnect;