#![cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    // Test 1 (Happy path): the MVP transaction executes successfully end-to-end
    #[test]
    fn test_happy_path_process_tap() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, TapScholarsContract);
        let client = TapScholarsContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let merchant = Address::generate(&env);
        let rfid_uid: u64 = 1049284;
        
        client.init(&admin);
        client.register_merchant(&merchant);
        client.top_up(&rfid_uid, &500); // Top up 500 units
        
        // Merchant processes a 25 unit fare tap
        client.process_tap(&rfid_uid, &merchant, &25);
        
        let new_balance = client.get_balance(&rfid_uid);
        assert_eq!(new_balance, 475);
    }

    // Test 2 (Edge case): Failure due to insufficient balance
    #[test]
    #[should_panic(expected = "Insufficient RFID balance")]
    fn test_insufficient_balance() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, TapScholarsContract);
        let client = TapScholarsContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let merchant = Address::generate(&env);
        let rfid_uid: u64 = 88888;
        
        client.init(&admin);
        client.register_merchant(&merchant);
        client.top_up(&rfid_uid, &10); // Only 10 units
        
        // Attempt to charge 25 units
        client.process_tap(&rfid_uid, &merchant, &25);
    }

    // Test 3 (State verification): Verify state updates correctly over multiple taps
    #[test]
    fn test_state_verification_multiple_taps() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, TapScholarsContract);
        let client = TapScholarsContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let merchant = Address::generate(&env);
        let rfid_uid: u64 = 12345;
        
        client.init(&admin);
        client.register_merchant(&merchant);
        client.top_up(&rfid_uid, &100);
        
        client.process_tap(&rfid_uid, &merchant, &10);
        client.process_tap(&rfid_uid, &merchant, &15);
        
        // 100 - 10 - 15 = 75
        assert_eq!(client.get_balance(&rfid_uid), 75);
    }

    // Test 4 (Edge case): Unregistered merchant attempts to process payment
    #[test]
    #[should_panic(expected = "Unauthorized merchant")]
    fn test_unauthorized_merchant() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, TapScholarsContract);
        let client = TapScholarsContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let fake_merchant = Address::generate(&env);
        let rfid_uid: u64 = 55555;
        
        client.init(&admin);
        client.top_up(&rfid_uid, &100);
        
        // fake_merchant was never registered via register_merchant
        client.process_tap(&rfid_uid, &fake_merchant, &20);
    }

    // Test 5 (Edge case): Prevent negative top-ups
    #[test]
    #[should_panic(expected = "Amount must be greater than zero")]
    fn test_invalid_top_up() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, TapScholarsContract);
        let client = TapScholarsContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        
        client.init(&admin);
        client.top_up(&11111, &-50);
    }
}
