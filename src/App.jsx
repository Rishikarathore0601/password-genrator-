import React, { useState, useEffect } from "react";
import "./App.css";

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function App() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(10);
  const [strengthColor, setStrengthColor] = useState("#ccc");
  const [checkedOptions, setCheckedOptions] = useState({
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
  });

  const [isCopied, setIsCopied] = useState(false); // For the popup

  const handleSlider = (value) => {
    setPasswordLength(value);
  };

  const generateRandomNumber = () => Math.floor(Math.random() * 10);
  const generateLowerCase = () =>
    String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  const generateUpperCase = () =>
    String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  const generateSymbol = () =>
    symbols.charAt(Math.floor(Math.random() * symbols.length));

  const setIndicator = (color) => {
    setStrengthColor(color);
  };

  const calcStrength = () => {
    const { uppercase, lowercase, numbers, symbols } = checkedOptions;
    const hasUpper = uppercase;
    const hasLower = lowercase;
    const hasNum = numbers;
    const hasSym = symbols;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
  };

  const shufflePassword = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  };

  const generatePassword = () => {
    const { uppercase, lowercase, numbers, symbols } = checkedOptions;
    let funcArr = [];

    if (uppercase) funcArr.push(generateUpperCase);
    if (lowercase) funcArr.push(generateLowerCase);
    if (numbers) funcArr.push(generateRandomNumber);
    if (symbols) funcArr.push(generateSymbol);

    if (funcArr.length === 0) return;

    let newPassword = "";
    for (let i = 0; i < funcArr.length; i++) {
      newPassword += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
      const randIndex = Math.floor(Math.random() * funcArr.length);
      newPassword += funcArr[randIndex]();
    }

    newPassword = shufflePassword(newPassword.split(""));
    setPassword(newPassword);
    calcStrength();
  };

  const copyContent = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setIsCopied(true); // Show the popup
      } catch (e) {
        console.error("Failed to copy!");
      }

      setTimeout(() => {
        setIsCopied(false); // Hide the popup after 2 seconds
      }, 2000);
    }
  };

  const handleCheckboxChange = (type) => {
    setCheckedOptions((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  useEffect(() => {
    calcStrength();
  }, [passwordLength, checkedOptions]);

  return (
    <div className="container">
      <h1>Password Generator</h1>

      <div className="display-container">
        <input
          type="text"
          readOnly
          placeholder="Password"
          className="display"
          value={password}
        />
        <button className="copyBtn" onClick={copyContent}>
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/material-outlined/24/copy.png"
            alt="copy"
          />
        </button>
      </div>

      {isCopied && <div className="popup">Copied to clipboard!</div>}

      <div className="input-container">
        <div className="length-container">
          <p>Password Length</p>
          <p>{passwordLength}</p>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          className="slider"
          step="1"
          value={passwordLength}
          onChange={(e) => handleSlider(e.target.value)}
        />

        <div className="check">
          <input
            type="checkbox"
            id="uppercase"
            checked={checkedOptions.uppercase}
            onChange={() => handleCheckboxChange("uppercase")}
          />
          <label htmlFor="uppercase">Includes Uppercase letters</label>
        </div>

        <div className="check">
          <input
            type="checkbox"
            id="lowercase"
            checked={checkedOptions.lowercase}
            onChange={() => handleCheckboxChange("lowercase")}
          />
          <label htmlFor="lowercase">Includes Lowercase letters</label>
        </div>

        <div className="check">
          <input
            type="checkbox"
            id="numbers"
            checked={checkedOptions.numbers}
            onChange={() => handleCheckboxChange("numbers")}
          />
          <label htmlFor="numbers">Includes Numbers</label>
        </div>

        <div className="check">
          <input
            type="checkbox"
            id="symbols"
            checked={checkedOptions.symbols}
            onChange={() => handleCheckboxChange("symbols")}
          />
          <label htmlFor="symbols">Includes Symbols</label>
        </div>

        <div className="strength-container">
          <p>Strength</p>
          <div
            className="indicator"
            style={{ backgroundColor: strengthColor }}
          ></div>
        </div>

        <button className="generateButton" onClick={generatePassword}>
          Generate Password
        </button>
      </div>
    </div>
  );
}

export default App;
