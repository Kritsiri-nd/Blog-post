import React from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const SignUpSuccess = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SuccessModal
        isOpen={true}
        onClose={handleContinue}
        title="Registration success"
        buttonText="Continue"
        onButtonClick={handleContinue}
      />
    </div>
  );
};

export default SignUpSuccess;
