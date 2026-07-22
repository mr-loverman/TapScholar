import { useState } from "react";
import {
  FaWallet,
  FaIdCard,
  FaStore,
  FaBolt,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

import { connectWallet } from "./stellar/freighter";

import {
  topUp,
  registerMerchant,
  processTap,
  getBalance,
} from "./stellar/contract";

import "./App.css";
import Hero from "./assets/hero.jpeg";

function App() {
  const [wallet, setWallet] = useState("");
  const [rfid, setRfid] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [result, setResult] = useState("");

  async function handleConnect() {
    try {
      const address = await connectWallet();
      setWallet(address);
      setResult("✅ Wallet Connected");
    } catch (error) {
      console.error(error);
      setResult(error.message);
    }
  }

  async function handleTopUp() {
    try {
      setResult("Processing top up...");

      const response = await topUp(
        wallet,
        rfid,
        amount
      );

      console.log(response);

      setResult("✅ Top Up Successful");
    } catch (error) {
      console.error(error);
      setResult(error.message);
    }
  }

  async function handleRegisterMerchant() {
    try {
      setResult("Registering Merchant...");

      const response =
        await registerMerchant(
          wallet,
          merchant
        );

      console.log(response);

      setResult(
        "✅ Merchant Registered"
      );
    } catch (error) {
      console.error(error);
      setResult(error.message);
    }
  }

  async function handleProcessTap() {
    try {
      setResult(
        "Processing Payment..."
      );

      const response =
        await processTap(
          wallet,
          rfid,
          merchant,
          amount
        );

      console.log(response);

      setResult(
        "✅ Payment Processed"
      );
    } catch (error) {
      console.error(error);
      setResult(error.message);
    }
  }

  async function handleBalance() {
    try {
      setResult(
        "Fetching balance..."
      );

      const response =
        await getBalance(
          wallet,
          rfid
        );

      console.log(
        "FULL BALANCE RESPONSE:",
        response
      );

      setResult(
        JSON.stringify(
          response,
          null,
          2
        )
      );
    } catch (error) {
      console.error(error);

      setResult(
        error?.message ||
          "Failed to fetch balance"
      );
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          TapScholars
        </div>

        {!wallet ? (
          <button
            className="wallet-btn"
            onClick={handleConnect}
          >
            <FaWallet />
            Connect Freighter
          </button>
        ) : (
          <div className="connected">
            {wallet.slice(0, 8)}...
            {wallet.slice(-6)}
          </div>
        )}
      </nav>

      <section className="hero">
        <div className="hero-left">
          <span className="badge">
            Powered by Stellar
          </span>

          <h1>
            Tap. Ride. Eat.
            <br />
            Pay Instantly.
          </h1>

          <p>
            Transform school IDs into secure RFID
            payment cards for transportation and
            cafeteria purchases using Soroban
            Smart Contracts.
          </p>

          <button
            className="cta"
            onClick={handleConnect}
          >
            Get Started
          </button>
        </div>

        <div className="hero-right">
          {Hero}
        </div>
      </section>

      <section className="features">
        <h2>Why TapScholars?</h2>

        <div className="cards">
          <div className="card">
            <FaIdCard className="icon" />
            <h3>RFID Student ID</h3>
            <p>
              Use existing student IDs
              for seamless cashless
              payments.
            </p>
          </div>

          <div className="card">
            <FaBolt className="icon" />
            <h3>Instant Settlement</h3>
            <p>
              Payments settle instantly
              on Stellar.
            </p>
          </div>

          <div className="card">
            <FaStore className="icon" />
            <h3>Merchant Friendly</h3>
            <p>
              Merchants receive payment
              immediately.
            </p>
          </div>
        </div>
      </section>

      <section className="process">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <FaIdCard className="stepIcon" />
            <h3>Tap RFID</h3>
          </div>

          <div className="arrow">
            →
          </div>

          <div className="step">
            <FaWallet className="stepIcon" />
            <h3>Soroban</h3>
          </div>

          <div className="arrow">
            →
          </div>

          <div className="step">
            <FaCheckCircle className="stepIcon" />
            <h3>Approved</h3>
          </div>

          <div className="arrow">
            →
          </div>

          <div className="step">
            <FaMoneyBillWave className="stepIcon" />
            <h3>Paid</h3>
          </div>
        </div>
      </section>

      <section className="dashboard">
        <div className="balance-card">
          <p>Wallet Connected</p>

          <h3>
            {wallet
              ? wallet.substring(
                  0,
                  16
                ) + "..."
              : "Not Connected"}
          </h3>
        </div>

        <div className="actions">
          <input
            placeholder="RFID UID"
            value={rfid}
            onChange={(e) =>
              setRfid(
                e.target.value
              )
            }
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
          />

          <input
            placeholder="Merchant Address"
            value={merchant}
            onChange={(e) =>
              setMerchant(
                e.target.value
              )
            }
          />

          <div className="btn-grid">
            <button
              onClick={handleTopUp}
            >
              Top Up
            </button>

            <button
              onClick={
                handleRegisterMerchant
              }
            >
              Register Merchant
            </button>

            <button
              onClick={
                handleProcessTap
              }
            >
              Process Tap
            </button>

            <button
              onClick={
                handleBalance
              }
            >
              Get Balance
            </button>
          </div>

          <div className="result">
            <pre>{result}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;