import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { verify } from "../utils/verify";

const func: DeployFunction = async ({ getNamedAccounts, deployments: { deploy, get, log } }: HardhatRuntimeEnvironment) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!

    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // waitConfirmations: networkConfig[network.name].blockConfirmations || 0
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }

    log("-----------------------------------------------------")
}

export default func;
func.tags = ["all", "fundme"]