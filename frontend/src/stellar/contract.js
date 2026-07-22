import {
  Contract,
  rpc,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
} from "@stellar/stellar-sdk";

import { signTransaction } from "@stellar/freighter-api";

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID;

const server = new rpc.Server(
  "https://soroban-testnet.stellar.org"
);

async function invokeContract(
  walletAddress,
  method,
  args = []
) {
  const account =
    await server.getAccount(walletAddress);

  const contract =
    new Contract(CONTRACT_ID);

  let tx = new TransactionBuilder(
    account,
    {
      fee: BASE_FEE,
      networkPassphrase:
        Networks.TESTNET,
    }
  )
    .addOperation(
      contract.call(method, ...args)
    )
    .setTimeout(30)
    .build();

  tx =
    await server.prepareTransaction(
      tx
    );

  const signedTx =
    await signTransaction(
      tx.toXDR(),
      {
        networkPassphrase:
          Networks.TESTNET,
      }
    );

  const transaction =
    TransactionBuilder.fromXDR(
      signedTx.signedTxXdr,
      Networks.TESTNET
    );

  return await server.sendTransaction(
    transaction
  );
}

export async function topUp(
  walletAddress,
  rfidUid,
  amount
) {
  return invokeContract(
    walletAddress,
    "top_up",
    [
      nativeToScVal(Number(rfidUid)),
      nativeToScVal(Number(amount)),
    ]
  );
}

export async function registerMerchant(
  walletAddress,
  merchant
) {
  return invokeContract(
    walletAddress,
    "register_merchant",
    [
      nativeToScVal(merchant),
    ]
  );
}

export async function processTap(
  walletAddress,
  rfidUid,
  merchant,
  amount
) {
  return invokeContract(
    walletAddress,
    "process_tap",
    [
      nativeToScVal(Number(rfidUid)),
      nativeToScVal(merchant),
      nativeToScVal(Number(amount)),
    ]
  );
}

export async function getBalance(
  walletAddress,
  rfidUid
) {
  return invokeContract(
    walletAddress,
    "get_balance",
    [
      nativeToScVal(Number(rfidUid)),
    ]
  );
}