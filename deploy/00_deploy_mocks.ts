import {network} from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, DECIMALS, INITIAL_ANSWER } from "../helper-hardhat-config";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func:DeployFunction = async({deployments: {deploy, log}, getNamedAccounts}:HardhatRuntimeEnvironment) => {
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    if(developmentChains.includes(network.name)) {
        log("Local Network detected! Deploying Mocks")
        await deploy("MockV3Aggregator", {
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true
        })
        log("Mocks Deployed")
        log("---------------------------------")
    }
}

export default func;
func.tags = ["all", "mocks"];