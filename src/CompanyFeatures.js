import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import Web3 from 'web3';
import SneakerQrContract from './contracts/QrStore.json'; // replace this with the actual path

let web3;
let sneakerQr;

const CompanyFeatures = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qr, setQr] = useState(null);
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

  const generateQR = async () => {
    const qrData = `Brand: ${brand}, Model: ${model}, Color: ${color}, Size: ${size}`;
    setQr(qrData);
    try {
      const response = await sneakerQr.methods.storeQrData(qrData).send({ from: account });
      console.log(response);
    } catch (error) {
      console.error("Error storing QR code on blockchain: ", error);
    }
  };

  return (
    <div className="companyFeatures">
      <h2>Company Features</h2>
      <input type="text" placeholder="Brand" onChange={e => setBrand(e.target.value)} />
      <input type="text" placeholder="Model" onChange={e => setModel(e.target.value)} />
      <input type="text" placeholder="Color" onChange={e => setColor(e.target.value)} />
      <input type="text" placeholder="Size" onChange={e => setSize(e.target.value)} />
      <button onClick={generateQR}>Generate</button>
      {qr && <QRCode value={qr} />}
    </div>
  );
};

export default CompanyFeatures;