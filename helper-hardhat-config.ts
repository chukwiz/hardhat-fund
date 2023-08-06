export interface INetworkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: string]: INetworkConfigItem
}

const networkConfig:networkConfigInfo = {
    sepolia: {
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        blockConfirmations: 6,
    },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

export { networkConfig, developmentChains, DECIMALS, INITIAL_ANSWER };