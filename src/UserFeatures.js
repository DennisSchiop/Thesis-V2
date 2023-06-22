import React, { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';
import 'webrtc-adapter';
import SneakerQrContract from './contracts/QrStore.json'; // replace this with the actual path
import jsQR from "jsqr";

let web3;
let sneakerQr;

const UserFeatures = () => {
  const [scanning, setScanning] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [account, setAccount] = useState('');
  const videoRef = useRef();
  const [scanned, setScanned] = useState(false);

  const startScanning = () => {
    setScanning(true);
    setScanned(false); // Reset scanned state when starting a new scan
  };

  const stopScanning = () => {
    setScanning(false);
  };

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

  useEffect(() => {
    if (scanning) {
      const video = videoRef.current;

      if (video) {  // Check if video is defined
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
          video.srcObject = stream;
          video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
          video.play();
          requestAnimationFrame(tick);
        });

        const tick = () => {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });
            if (code) {
              handleScan(code.data);
            }
          }

          requestAnimationFrame(tick);
        };
      }
    }
  }, [scanning]);

  const handleScan = async (data) => {
    if (scanned) { // Add this condition
      return;
    }

    console.log(data); // log the data read from the QR code
    if (data) {
      const qrData = await sneakerQr.methods.getQrData(account).call(); // get the data from the blockchain
      console.log(qrData); // log the data from the blockchain
      if (qrData === data) {
        setGallery(prevGallery => [...prevGallery, "Authentic Sneaker"]);
        stopScanning(); // stop scanning once a valid QR code has been scanned
      } else {
        setGallery(prevGallery => [...prevGallery, "Not Authentic Sneaker"]);
        stopScanning(); // stop scanning once a QR code has been scanned, even if it's not valid
      } setScanned(true); // Set scanned to true after a successful scan
    }
  };

    

return (
    <div className="userFeatures">
        <h2>User Features</h2>
        <button onClick={startScanning}>Start Scanning</button>
        {scanning && (
            <div>
                <video ref={videoRef} style={{ width: '100%' }} />
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