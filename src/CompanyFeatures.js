import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import Web3 from 'web3';
import QrStoreContract from './contracts/QrStore.json';
import './CompanyFeatures.css';

let web3;
let qrStore;

const CompanyFeatures = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [qr, setQr] = useState(null);
  const [account, setAccount] = useState('');
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
      }

      web3 = window.web3;

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = '5777';
      const deployedNetwork = QrStoreContract.networks[networkId];

      if (deployedNetwork) {
        qrStore = new web3.eth.Contract(QrStoreContract.abi, deployedNetwork.address);
      } else {
        console.error('No deployed network found for network ID: ', networkId);
      }
    };

    loadBlockchainData();
  }, []);

  const generateQR = async () => {
    const qrData = {
      brand: brand,
      model: model,
      color: color,
      size: size,
      imageUrl: imageUrl
    };

    setQr(JSON.stringify(qrData));

    try {
      const response = await qrStore.methods.storeQrData(JSON.stringify(qrData)).send({ from: account });
      console.log(response);
    } catch (error) {
      console.error('Error storing QR code on blockchain: ', error);
    }
  };

  const downloadQR = () => {
    const canvas = qrCodeRef.current.querySelector('canvas');
    const imageUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = 'qr_code.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="companyFeatures">
      <h2>Company Features</h2>
      <input type="text" placeholder="Brand" onChange={e => setBrand(e.target.value)} />
      <input type="text" placeholder="Model" onChange={e => setModel(e.target.value)} />
      <input type="text" placeholder="Color" onChange={e => setColor(e.target.value)} />
      <input type="text" placeholder="Size" onChange={e => setSize(e.target.value)} />
      <input type="text" placeholder="Image URL" onChange={e => setImageUrl(e.target.value)} />
      <button onClick={generateQR}>Generate</button>
      {qr && <div ref={qrCodeRef}><QRCode value={qr} size={256} /></div>}
      {qr && <button onClick={downloadQR}>Download QR Code</button>}
    </div>
  );
};

export default CompanyFeatures;
