import { ethers } from "hardhat"
import { FundMe } from "../typechain-types"

async function main() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const fundMe:FundMe = await ethers.getContract("FundMe", deployer)

    console.log("withdrawing funds...")
    
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Withdrawn")
}

main().then(() => process.exit(0)).catch((error) => {
    console.log(error)
    process.exit(1)
})