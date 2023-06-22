import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import './WalletCard.css';

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accountChangedHandler);
      window.ethereum.on('chainChanged', chainChangedHandler);
    } else {
      console.error('MetaMask is not installed.');
    }
  }, []);

  const connectWithMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setConnButtonText('Connecting...'); 

        // Request access to MetaMask accounts
        await window.ethereum.enable();

        // Create a new web3 instance
        const web3 = new Web3(window.ethereum);

        // Get the selected account
        const accounts = await web3.eth.getAccounts();
        accountChangedHandler(accounts[0]);

        // Update button text to indicate successful connection
        setConnButtonText('Wallet Connected');

        // Wait for a few seconds before redirecting to the selection page
        await new Promise((resolve) => setTimeout(resolve, 3000));

        navigate('/selection'); // Redirect to the selection page
      } catch (error) {
        // Handle error while connecting with MetaMask
        setErrorMessage(error.message);
        setConnButtonText('Connect Wallet'); // Reset button text
        console.error('Error connecting with MetaMask:', error);
      }
    } else {
      // Handle case when MetaMask is not installed
      setErrorMessage('Please install MetaMask browser extension to interact');
      console.error('MetaMask is not installed.');
    }
  };

  // Update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = async (account) => {
    try {
      const balance = await window.web3.eth.getBalance(account);
      setUserBalance(window.web3.utils.fromWei(balance, 'ether'));
    } catch (err) {
      setErrorMessage(err.message);
      console.error('Error getting account balance:', err);
    }
  };

  const chainChangedHandler = () => {
    // Reload the page to avoid any errors with chain change mid-use of the application
    window.location.reload();
  };

  return (
    <div className="walletCard">
      <h4>Connect with your MetaMask wallet!</h4>
      <button onClick={connectWithMetaMask}>{connButtonText}</button>
      <div className="accountDisplay">
        <h3>Address: {defaultAccount}</h3>
      </div>
      <div className="balanceDisplay">
        <h3>Balance: {userBalance}</h3>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default WalletCard;
