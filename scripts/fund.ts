import { ethers, getNamedAccounts } from "hardhat"
import { FundMe } from "../typechain-types"

async function main() {
    // const {deployer} = await getNamedAccounts()
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    const fundMe:FundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding contract...")

    const transactionResponse = await fundMe.fund({value: ethers.parseEther("0.1")})
    await transactionResponse.wait(1)
    console.log("Funded")
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error)
    process.exit(1)
})