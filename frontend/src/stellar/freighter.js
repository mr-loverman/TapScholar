import {
  isConnected,
  requestAccess,
  getAddress,
} from "@stellar/freighter-api";

export async function connectWallet() {
  const connection = await isConnected();

  if (!connection.isConnected) {
    throw new Error(
      "Freighter Wallet is not installed."
    );
  }

  await requestAccess();

  const address = await getAddress();

  return address.address;
}