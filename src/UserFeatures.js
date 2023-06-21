import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import Web3 from 'web3';
import SneakerQrContract from './contracts/QrStore.json'; // replace this with the actual path

let web3;
let sneakerQr;

const UserFeatures = () => {
  const [gallery, setGallery] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      // Check if Web3 has been injected by the browser
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request account access
      }
      // Or fall back to Ganache if no injected web3 instance is detected
      else {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
      }

      web3 = window.web3;

      // Load account
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      // Create a JavaScript version of the smart contract
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SneakerQrContract.networks[networkId];
      sneakerQr = new web3.eth.Contract(
        SneakerQrContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
    };

    loadBlockchainData();
  }, []);

  const handleScan = async (data) => {
    if (data) {
      const qrData = await sneakerQr.methods.getQrData(0x5c873eE349a12A523bA5a9b233BA5F32bF7286bF).call();
      if (qrData === data) {
        setGallery(prevGallery => [...prevGallery, "Authentic Sneaker"]);
      } else {
        setGallery(prevGallery => [...prevGallery, "Not Authentic Sneaker"]);
      }
    }
  };
  

  const handleError = (error) => {
    console.log(error);
  };

  const startScanning = () => {
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <div className="userFeatures">
      <h2>User Features</h2>
      <button onClick={startScanning}>Scan your sneakers</button>
      {scanning && (
        <div className="qrScanner">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
          <button onClick={stopScanning}>Stop Scanning</button>
        </div>
      )}
      <div className="gallery">
        {gallery.length > 0 ? (
          gallery.map((sneaker, index) => (
            <div className="sneakerItem" key={index}>
              {sneaker}
            </div>
          ))
        ) : (
          <p>No sneakers scanned yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserFeatures;
