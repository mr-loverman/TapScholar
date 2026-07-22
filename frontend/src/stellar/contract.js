import {
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  rpc,
  nativeToScVal,
} from "@stellar/stellar-sdk";

import { signTransaction } from "@stellar/freighter-api";

const CONTRACT_ID =
  import.meta.env.VITE_CONTRACT_ID;

const server = new rpc.Server(
  "https://soroban-testnet.stellar.org"
);

async function waitForTransaction(hash) {
  while (true) {
    const result =
      await server.getTransaction(hash);

    if (
      result.status === "SUCCESS"
    ) {
      return result;
    }

    if (
      result.status === "FAILED"
    ) {
      throw new Error(
        "Transaction Failed"
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );
  }
}

async function invokeContract(
  walletAddress,
  method,
  args = []
) {
  try {
    const account =
      await server.getAccount(
        walletAddress
      );

    const contract =
      new Contract(CONTRACT_ID);

    let tx =
      new TransactionBuilder(
        account,
        {
          fee: BASE_FEE,
          networkPassphrase:
            Networks.TESTNET,
        }
      )
        .addOperation(
          contract.call(
            method,
            ...args
          )
        )
        .setTimeout(30)
        .build();

    tx =
      await server.prepareTransaction(
        tx
      );

    const signed =
      await signTransaction(
        tx.toXDR(),
        {
          networkPassphrase:
            Networks.TESTNET,
        }
      );

    const signedTx =
      TransactionBuilder.fromXDR(
        signed.signedTxXdr,
        Networks.TESTNET
      );

    const sendResponse =
      await server.sendTransaction(
        signedTx
      );

    if (
      sendResponse.status ===
      "PENDING"
    ) {
      return await waitForTransaction(
        sendResponse.hash
      );
    }

    return sendResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
      nativeToScVal(
        Number(rfidUid)
      ),
      nativeToScVal(
        Number(amount)
      ),
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
      nativeToScVal(
        Number(rfidUid)
      ),
      nativeToScVal(merchant),
      nativeToScVal(
        Number(amount)
      ),
    ]
  );
}

/*
 * READ BALANCE
 */
export async function getBalance(
  walletAddress,
  rfidUid
) {
  try {
    const account =
      await server.getAccount(
        walletAddress
      );

    const contract =
      new Contract(CONTRACT_ID);

    const tx =
      new TransactionBuilder(
        account,
        {
          fee: BASE_FEE,
          networkPassphrase:
            Networks.TESTNET,
        }
      )
        .addOperation(
          contract.call(
            "get_balance",
            nativeToScVal(
              Number(rfidUid)
            )
          )
        )
        .setTimeout(30)
        .build();

    const sim =
      await server.simulateTransaction(
        tx
      );

    console.log(
      "Balance Response:",
      sim
    );

    return sim;
  } catch (error) {
    console.error(error);
    throw error;
  }
}