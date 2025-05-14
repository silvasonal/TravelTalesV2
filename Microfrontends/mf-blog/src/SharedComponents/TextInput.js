import React from 'react';
import '../styles/index.css';

const TextInput = ({ id, label, type, value, onChange, placeholder, required,errorMessage }) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>
        {label} {required && <span style={{ color: 'red' }}>*</span>} 
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={errorMessage ? 'input-error' : ''}
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>} 
    </div>
  );
};


export default TextInput;