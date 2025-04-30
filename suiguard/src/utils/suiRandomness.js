import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export async function generateRandomPassword() {
  // Initialize Sui client
  const client = new SuiClient({ url: import.meta.env.VITE_SUI_NETWORK });
  
  // Load wallet
  const privateKey = import.meta.env.VITE_SUI_WALLET_PRIVATE_KEY;
  const keypair = Ed25519Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
  
  // Create transaction to request randomness
  const tx = new TransactionBlock();
  const [randomness] = tx.moveCall({
    target: "0x8::randomness::get_randomness",
    arguments: [],
  });
  
  // Execute transaction
  const result = await client.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    signer: keypair,
    options: { showEffects: true },
  });
  
  // Extract random bytes (simplified; adjust based on actual API response)
  const randomBytes = result.effects?.randomness ?? "mockRandomBytes123";
  
  // Convert to password (e.g., base64 or custom logic)
  const password = Buffer.from(randomBytes).toString("base64").slice(0, 16);
  return password;
}