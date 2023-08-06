import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { FundMe } from "../../typechain-types"
import { assert } from "chai"


developmentChains.includes(network.name) ? describe.skip
    : describe("FundMe", async function () {
        let fundMe:FundMe, deployer: SignerWithAddress, sendValue = ethers.parseEther("1")

        beforeEach(async function () {
            const accounts = await ethers.getSigners()
            deployer = accounts[0]
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it("allows people to fund and withdraw", async function() {
            await fundMe.fund({value: sendValue})
            await fundMe.withdraw()

            const address = await fundMe.getAddress()
            const endingBalance = await ethers.provider.getBalance(address)

            assert.equal(endingBalance.toString(), "0")
        })
    })