import React from 'react';
import '../App.css';

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );
}

export default ErrorMessage;



