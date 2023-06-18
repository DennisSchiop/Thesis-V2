import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#e8e4f5',
        animation: 'fadeIn 1s',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#6c63ff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          animation: 'slideIn 1s',
        }}
      >
        Choose your role
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#6c63ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0px 4px 10px rgba(108, 99, 255, 0.3)',
            transition: 'background-color 0.3s ease, transform 0.3s ease, boxShadow 0.3s ease',
            animation: 'slideIn 1s',
          }}
          onClick={() => handleSelection('user')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a53cc';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0px 6px 15px rgba(90, 83, 204, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6c63ff';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0px 4px 10px rgba(108, 99, 255, 0.3)';
          }}
        >
          Continue as User
        </button>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#6c63ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0px 4px 10px rgba(108, 99, 255, 0.3)',
            transition: 'background-color 0.3s ease, transform 0.3s ease, boxShadow 0.3s ease',
            animation: 'slideIn 1s',
          }}
          onClick={() => handleSelection('company')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a53cc';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0px 6px 15px rgba(90, 83, 204, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6c63ff';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0px 4px 10px rgba(108, 99, 255, 0.3)';
          }}
        >
          Continue as Company
        </button>
      </div>
    </div>
  );
};

export default UserCompanySelection;
