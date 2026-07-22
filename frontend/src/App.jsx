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
import Hero from "./assets/hero.jpeg"

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
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleTopUp() {
    try {
      await topUp(wallet, rfid, amount);
      setResult("✅ Top up successful");
    } catch (error) {
      setResult(error.message);
    }
  }

  async function handleProcessTap() {
    try {
      await processTap(
        wallet,
        rfid,
        merchant,
        amount
      );
      setResult("✅ Payment processed");
    } catch (error) {
      setResult(error.message);
    }
  }

  async function handleRegisterMerchant() {
    try {
      await registerMerchant(
        wallet,
        merchant
      );
      setResult("✅ Merchant registered");
    } catch (error) {
      setResult(error.message);
    }
  }

  async function handleBalance() {
    try {
      const response = await getBalance(
        wallet,
        rfid
      );

      setResult(
        JSON.stringify(response, null, 2)
      );
    } catch (error) {
      setResult(error.message);
    }
  }

  return (
    <div className="app">
      {/* NAVBAR */}

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

      {/* HERO */}

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
            Transform school IDs into
            secure RFID payment cards for
            transportation and cafeteria
            purchases using Soroban Smart
            Contracts.
          </p>

          <button
            className="cta"
            onClick={handleConnect}
          >
            Get Started
          </button>
        </div>

        <div className="hero-right">
          <img src={Hero}/>
        </div>
      </section>

      {/* FEATURES */}

      <section className="features">
        <h2>Why TapScholars?</h2>

        <div className="cards">
          <div className="card">
            <FaIdCard className="icon" />
            <h3>RFID Student ID</h3>
            <p>
              Use existing student IDs for
              cashless payments.
            </p>
          </div>

          <div className="card">
            <FaBolt className="icon" />
            <h3>Instant Settlement</h3>
            <p>
              Payments settle instantly
              through Stellar.
            </p>
          </div>

          <div className="card">
            <FaStore className="icon" />
            <h3>Merchant Friendly</h3>
            <p>
              Cafeterias and drivers receive
              funds immediately.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}

      <section className="process">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <FaIdCard className="stepIcon" />
            <h3>Tap RFID</h3>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <FaWallet className="stepIcon" />
            <h3>Soroban Contract</h3>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <FaCheckCircle className="stepIcon" />
            <h3>Payment Approved</h3>
          </div>

          <div className="arrow">→</div>

          <div className="step">
            <FaMoneyBillWave className="stepIcon" />
            <h3>Merchant Paid</h3>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}

      <section className="dashboard">
        <div className="balance-card">
          <p>Wallet Connected</p>
          <h3>
            {wallet
              ? wallet.substring(0, 16) +
                "..."
              : "Not Connected"}
          </h3>
        </div>

        <div className="actions">
          <input
            placeholder="RFID UID"
            value={rfid}
            onChange={(e) =>
              setRfid(e.target.value)
            }
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <input
            placeholder="Merchant Address"
            value={merchant}
            onChange={(e) =>
              setMerchant(e.target.value)
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
              onClick={handleBalance}
            >
              Get Balance
            </button>
          </div>

          <div className="result">
            {result}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;