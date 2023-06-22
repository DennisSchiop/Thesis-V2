import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserCompanySelection.css';

const UserCompanySelection = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    if (role === 'user') {
      navigate('/user');
    } else if (role === 'company') {
      navigate('/company');
    }
  };

  return (
    <div className="userCompanySelection">
      <h2>Choose your role</h2>
      <div className="buttonContainer">
        <button
          className="selectionButton"
          onClick={() => handleSelection('user')}
        >
          Continue as User
        </button>
        <button
          className="selectionButton"
          onClick={() => handleSelection('company')}
        >
          Continue as Company
        </button>
      </div>
    </div>
  );
};

export default UserCompanySelection;
