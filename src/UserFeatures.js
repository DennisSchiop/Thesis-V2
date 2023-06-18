import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import './UserFeatures.css';

const UserFeatures = () => {
  const [gallery, setGallery] = useState([]);
  const [scanning, setScanning] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setGallery((prevGallery) => [...prevGallery, data]);
    }
  };

  const handleError = (error) => {
    console.error('Error when trying to scan QR code:', error);
  };

  const startScanning = () => {
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };
  

  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        stopScanning();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [scanning]);

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
              {/* Display sneaker information */}
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
