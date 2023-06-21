import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import Web3 from 'web3';
import QrStoreContract from './contracts/QrStore.json';

let web3;
let qrStore;

const CompanyFeatures = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qr, setQr] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
      }

      web3 = window.web3;

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = '5777';
      console.log('Network ID: ', networkId); // log networkId

      const deployedNetwork = QrStoreContract.networks[networkId];
      console.log('Deployed Network: ', deployedNetwork); // log deployedNetwork

      if (deployedNetwork) {
        qrStore = new web3.eth.Contract(
          QrStoreContract.abi,
          deployedNetwork.address,
        );
      } else {
        console.error('No deployed network found for network ID: ', networkId);
      }

      console.log('QrStore Contract: ', QrStoreContract); // log QrStoreContract
      console.log('QR Store: ', qrStore);  // log qrStore
    };

    loadBlockchainData();
  }, []);

  const generateQR = async () => {
    const qrData = `Brand: ${brand}, Model: ${model}, Color: ${color}, Size: ${size}`;
    setQr(qrData);
    try {
      const response = await qrStore.methods.storeQrData(qrData).send({ from: account });
      console.log(response);
    } catch (error) {
      console.error("Error storing QR code on blockchain: ", error);
    }

    console.log('Account: ', account);
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
