import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { developmentChains } from "../../helper-hardhat-config";

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {

        let fundMe: FundMe
        let sendValue = ethers.parseEther("1")
        let mockV3Aggregator: MockV3Aggregator & {
            address: string
        }
        let deployer: SignerWithAddress
        beforeEach(async () => {
            if (!developmentChains.includes(network.name)) {
                throw "You need to be on a development chain to run tests"
            }
            const accounts = await ethers.getSigners()
            deployer = accounts[0]
            await deployments.fixture(["all"])
            fundMe = await ethers.getContract("FundMe")
            mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
        })

        describe("constructor", function () {
            it("sets the aggregator addresses correctly", async () => {
                const response = await fundMe.getPriceFeed()
                assert.equal(response, mockV3Aggregator.target)
            })
        })

        describe("fund", async function () {
            it("fails if you dont send enough eth", async function () {
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more eth")
            })

            it("updated the amount funded data structure", async function () {
                await fundMe.fund({ value: sendValue })
                const response = await fundMe.getAddressToAmountFunded(deployer)

                assert.equal(response.toString(), sendValue.toString())
            })

            it("Adds funder to array of funders", async function () {
                await fundMe.fund({ value: sendValue })
                const funder = await fundMe.getFunder(0)
                assert.equal(funder, deployer.address)
            })

            describe("withdraw", async function () {
                beforeEach(async function () {
                    await fundMe.fund({ value: sendValue })
                })

                it("withdraws eth by a single funder", async function () {
                    const address = await fundMe.getAddress()
                    const startingFundMeBalance = await ethers.provider.getBalance(address)
                    const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                    const transactionResponse = await fundMe.withdraw()
                    const transactionReceipt = await transactionResponse.wait(1)

                    const gasUsed = transactionReceipt?.gasUsed as bigint
                    const gasPrice = transactionReceipt?.gasPrice as bigint
                    let gasCost
                    gasCost = gasUsed * gasPrice

                    // if (gasPrice && gasUsed) {
                    // }


                    const endingFundMeBalance = await ethers.provider.getBalance(address)
                    const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                    assert.equal(endingFundMeBalance.toString(), "0");
                    assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())

                })

                it("allows us to withdraw with multiple funders", async function () {
                    const accounts = await ethers.getSigners()
                    for (let i = 1; i < 6; i++) {
                        const fundMeConnectedContract = await fundMe.connect(accounts[i])
                        await fundMeConnectedContract.fund({ value: sendValue })
                    }

                    const address = await fundMe.getAddress()
                    const startingFundMeBalance = await ethers.provider.getBalance(address)
                    const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                    const transactionResponse = await fundMe.withdraw()
                    const transactionReceipt = await transactionResponse.wait(1)

                    const gasUsed = transactionReceipt?.gasUsed as bigint
                    const gasPrice = transactionReceipt?.gasPrice as bigint
                    let gasCost
                    gasCost = gasUsed * gasPrice

                    // Assert

                    const endingFundMeBalance = await ethers.provider.getBalance(address)
                    const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                    assert.equal(endingFundMeBalance.toString(), "0");
                    assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())

                    // make sure funders are reset properly
                    await expect(fundMe.getFunder(0)).to.be.reverted

                    for (let i = 1; i < 6; i++) {
                        assert.equal((await fundMe.getAddressToAmountFunded(accounts[i].address)).toString(), "0")
                    }

                })

                it("only allows the owner to withdraw", async function () {
                    const accounts = await ethers.getSigners()
                    const attacker = accounts[1]
                    const connectedAttacker = await fundMe.connect(attacker)
                    await expect(connectedAttacker.withdraw()).to.be.reverted
                })
            })
        })
    })