import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalletCard from './WalletCard';
import UserCompanySelection from './UserCompanySelection';
import UserFeatures from './UserFeatures';
import CompanyFeatures from './CompanyFeatures';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<WalletCard />} />
          <Route path="/selection" element={<UserCompanySelection />} />
          <Route path="/user" element={<UserFeatures />} />
          <Route path="/company" element={<CompanyFeatures />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
