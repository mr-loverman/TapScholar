# TapScholars

**One-line description:** An RFID-linked micropayment system allowing students to pay school and transport fares instantly on Stellar.

## Problem & Solution
**Problem:** High school students in Metro Manila carry loose cash for jeepney fares and cafeteria meals, exposing them to theft and loss, while jeepney drivers waste minutes per trip fumbling for exact change.
**Solution:** Students tap their school-issued RFID IDs on a driver’s or cafeteria’s mobile device, triggering a Soroban smart contract that instantly deducts USDC from the student's prepaid ID balance and settles directly to the merchant.

## Timeline
Can be fully built, simulated, and deployed with a working mobile/RFID reader mock within a standard 48-hour hackathon.

## Stellar Features Used
* Soroban Smart Contracts (State management & authorization logic)
* Stellar High-speed Micropayments (Internal ledger MVP logic)

## Vision and Purpose
To eliminate cash-handling friction for unbanked youths and transport drivers by transforming existing school IDs into powerful hardware wallets, driving real-world Web3 adoption in Southeast Asia.

## Prerequisites
* Rust toolchain (`rustup target add wasm32-unknown-unknown`)
* Soroban CLI (v22.0.0+)

## Quick Start

**1. Build the contract:**
```bash
soroban contract build
```

**2. Run tests:**
```bash
cargo test
```

**3. Deploy to Testnet:**
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/tap_scholars.wasm \
  --source admin_wallet \
  --network testnet
```

**4. Sample CLI Invocation (Process a Fare Tap):**
```bash
soroban contract invoke \
  --id <DEPLOYED_CONTRACT_ID> \
  --source merchant_wallet \
  --network testnet \
  -- \
  process_tap \
  --rfid_uid 1049284 \
  --merchant <MERCHANT_STELLAR_ADDRESS> \
  --amount 25
```

#Links
🔗 https://stellar.expert/explorer/testnet/tx/3f9b9c7bb69f1199c801ad25eaf8f940ab4e964ff245e4081c9c295ec4ecf230
🔗 https://lab.stellar.org/r/testnet/contract/CDMZ5I4JEGMZSK3WPMTAS4ZNTDNCU6RDCLCMOLJBLIO4GXGADZBPNAP2

## License
MIT License
