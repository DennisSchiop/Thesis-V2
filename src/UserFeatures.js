import React, { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';
import 'webrtc-adapter';
import SneakerQrContract from './contracts/QrStore.json';
import jsQR from "jsqr";
import './UserFeatures.css';

let web3;
let sneakerQr;

const UserFeatures = () => {
  const [scanning, setScanning] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [account, setAccount] = useState('');
  const videoRef = useRef();
  const [scanned, setScanned] = useState(false);
  const [showMessage, setShowMessage] = useState(false);


  const startScanning = () => {
    setScanning(true);
    setScanned(false); // Reset scanned state when starting a new scan
  };

  const stopScanning = () => {
    setScanning(false);
  };

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
    localStorage.setItem('gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    if (scanning) {
      const video = videoRef.current;

      if (video) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
          video.srcObject = stream;
          video.setAttribute("playsinline", true);
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
    if (scanned) {
      return;
    }

    console.log(data); // log the data read from the QR code
    if (data) {
      const qrData = await sneakerQr.methods.getQrData(account).call(); // get the data from the blockchain
      console.log(qrData); // log the data from the blockchain
      if (qrData === data) {
        setGallery(prevGallery => {
          const existingSneaker = prevGallery.find(sneaker => sneaker.details === data);
          if (existingSneaker) {
            return prevGallery;
          } else {
            return [...prevGallery, { status: "Authentic Sneaker", details: data }];
          }
        });
      } else {
        console.log("Not an authentic sneaker");
      }
      setScanned(true); // Set scanned to true after a successful scan
      setShowMessage(true); // Show the "Authentic Sneakers" message
      setTimeout(() => {
        setShowMessage(false); // Hide the message after 2 seconds
      }, 2000);
    }
  };

  useEffect(() => {
    const storedGallery = localStorage.getItem('gallery');
    if (storedGallery) {
      setGallery(JSON.parse(storedGallery));
    }
  }, []);

  const clearGallery = () => {
    setGallery([]);
    localStorage.removeItem('gallery');
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
      {showMessage && (
        <div className="authenticSneakerMessage">
          Authentic Sneakers
        </div>
      )}
      <div className="gallery">
        {gallery.length > 0 ? (
          gallery
            .filter(sneaker => sneaker.status === "Authentic Sneaker")
            .map((sneaker, index) => {
              const details = JSON.parse(sneaker.details);
              return (
                <div className="sneakerItem" key={index}>
                  <div className="sneakerDetails">
                    <p><strong>Brand:</strong> {details.brand}</p>
                    <p><strong>Model:</strong> {details.model}</p>
                    <p><strong>Color:</strong> {details.color}</p>
                    <p><strong>Size:</strong> {details.size}</p>
                  </div>
                  <img src={details.imageUrl} alt="Sneaker" />
                </div>
              );
            })
        ) : (
          <p>No authentic sneakers scanned yet.</p>
        )}
      </div>
      <button onClick={clearGallery}>Clear Gallery</button>
    </div>
  );
};

export default UserFeatures;
