import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import './MetaMask.css';

const CryptoWalletCard = () => {
  const [error, setError] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [buttonText, setButtonText] = useState('Connect Wallet');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', handleChainChange);
    } else {
      console.error('MetaMask is not installed.');
    }
  }, []);

  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setButtonText('Connecting...'); 

        // Request access to MetaMask accounts
        await window.ethereum.enable();

        // Create a new web3 instance
        const web3 = new Web3(window.ethereum);

        // Get the selected account
        const accounts = await web3.eth.getAccounts();
        handleAccountChange(accounts[0]);

        // Update button text to indicate successful connection
        setButtonText('Wallet Connected');

        // Wait for a few seconds before redirecting to the selection page
        await new Promise((resolve) => setTimeout(resolve, 3000));

        navigate('/selection'); // Redirect to the selection page
      } catch (error) {
        // Handle error while connecting with MetaMask
        setError(error.message);
        setButtonText('Connect Wallet'); // Reset button text
        console.error('Error connecting with MetaMask:', error);
      }
    } else {
      // Handle case when MetaMask is not installed
      setError('Please install MetaMask browser extension to interact');
      console.error('MetaMask is not installed.');
    }
  };

  // Update account, will cause component re-render
  const handleAccountChange = (newAccount) => {
    setCurrentAccount(newAccount);
    fetchAccountBalance(newAccount.toString());
  };

  const fetchAccountBalance = async (account) => {
    try {
      const balance = await window.web3.eth.getBalance(account);
      setAccountBalance(window.web3.utils.fromWei(balance, 'ether'));
    } catch (err) {
      setError(err.message);
      console.error('Error getting account balance:', err);
    }
  };

  const handleChainChange = () => {
    // Reload the page to avoid any errors with chain change mid-use of the application
    window.location.reload();
  };

  return (
    <div className="cryptoWalletCard">
      <h4>Connect with your MetaMask wallet!</h4>
      <button onClick={connectToMetaMask}>{buttonText}</button>
      <div className="accountInfo">
        <h3>Address: {currentAccount}</h3>
      </div>
      <div className="balanceInfo">
        <h3>Balance: {accountBalance}</h3>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CryptoWalletCard;
