#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Merchant(Address),
    Balance(u64), // RFID UID maps to an i128 balance
}

#[contract]
pub struct TapScholarsContract;

#[contractimpl]
impl TapScholarsContract {
    /// Initializes the contract with an admin who manages merchants.
    pub fn init(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Registers a merchant (driver or cafeteria) allowing them to process taps.
    pub fn register_merchant(env: Env, merchant: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Merchant(merchant), &true);
    }

    /// Simulates a parent topping up the student's RFID card balance.
    /// In a full production app, this would transfer standard tokens. 
    /// For MVP simplicity, we manage an internal ledger.
    pub fn top_up(env: Env, rfid_uid: u64, amount: i128) {
        if amount <= 0 {
            panic!("Amount must be greater than zero");
        }
        let current_balance: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(rfid_uid))
            .unwrap_or(0);
            
        env.storage()
            .persistent()
            .set(&DataKey::Balance(rfid_uid), &(current_balance + amount));
    }

    /// Core MVP Transaction: A registered merchant submits an RFID tap to collect a payment.
    pub fn process_tap(env: Env, rfid_uid: u64, merchant: Address, amount: i128) {
        // 1. Verify merchant is registered
        let is_merchant: bool = env
            .storage()
            .persistent()
            .get(&DataKey::Merchant(merchant.clone()))
            .unwrap_or(false);
        if !is_merchant {
            panic!("Unauthorized merchant");
        }
        
        // 2. Require merchant authorization to pull funds (prevents replay attacks)
        merchant.require_auth();

        // 3. Verify student balance
        let student_balance: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(rfid_uid))
            .unwrap_or(0);
            
        if student_balance < amount {
            panic!("Insufficient RFID balance");
        }

        // 4. Update student balance (deduct fare)
        env.storage()
            .persistent()
            .set(&DataKey::Balance(rfid_uid), &(student_balance - amount));
            
        // Note: In MVP, we just deduct the internal balance. 
        // In V2, we invoke token::Client::new(&env, &token_id).transfer(...) here.
    }

    /// View function to check a student's balance
    pub fn get_balance(env: Env, rfid_uid: u64) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(rfid_uid))
            .unwrap_or(0)
    }
}
