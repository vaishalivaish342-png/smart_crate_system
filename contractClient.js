const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const RPC_URL     = process.env.RPC_URL     || 'http://127.0.0.1:8545';
// Default Hardhat account #0 private key (safe for local dev only)
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

class ContractClient {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.wallet   = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.contract = null;
  }

  async init() {
    try {
      const artifactPath = path.join(
        __dirname,
        '../../artifacts/contracts/CrateTracker.sol/CrateTracker.json'
      );

      if (!fs.existsSync(artifactPath)) {
        console.warn('Contract artifact not found. Please deploy the contract first.');
        return false;
      }

      const artifact        = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      const contractAddress = process.env.CONTRACT_ADDRESS;

      if (!contractAddress) {
        console.warn('CONTRACT_ADDRESS not found in environment variables. Run deploy first.');
        return false;
      }

      this.contract = new ethers.Contract(contractAddress, artifact.abi, this.wallet);
      console.log('✅ Connected to CrateTracker at:', contractAddress);
      return true;
    } catch (error) {
      console.error('Failed to initialize contract client:', error);
      return false;
    }
  }

  async logEvent(crateId, timestamp, riskScore, dataHash, eventType) {
    if (!this.contract) throw new Error('Contract not initialized');

    console.log(`⛓  Logging blockchain event for crate: ${crateId}`);
    const tx      = await this.contract.logCrateEvent(crateId, timestamp, riskScore, dataHash, eventType);
    const receipt = await tx.wait();
    console.log(`✅ Block ${receipt.blockNumber} | TxHash: ${receipt.hash}`);
    return receipt.hash;
  }

  async getEventHistory(crateId) {
    if (!this.contract) throw new Error('Contract not initialized');

    const history = await this.contract.getEventHistory(crateId);
    return history.map(e => ({
      crateId:   e.crateId,
      timestamp: Number(e.timestamp),
      riskScore: e.riskScore,
      dataHash:  e.dataHash,
      eventType: e.eventType
    }));
  }
}

module.exports = new ContractClient();
