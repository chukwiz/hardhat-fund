import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "dotenv/config"


const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x43E4"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.21" },
      { version: "0.6.6" },
    ]
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    }
  },
  etherscan: {
    apiKey: 'ETHERSCAN_API_KEY'
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    user: {
      default: 1
    }
  },
};

export default config;
