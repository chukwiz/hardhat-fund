import { run } from "hardhat"
import { SubtaskArguments, TaskArguments } from "hardhat/types"

const verify = async (contractAddress:TaskArguments, args:SubtaskArguments) => {
    try {
        await run("verify:verify", {
          address: contractAddress,
          constructorArguments: args,
    
        })
      } catch (error: any) {
        if (error.message.toLowerCase().includes("already verified")) {
          console.log('Already Verified')
        } else {
          console.log(error)
        }
      }
}

export {verify}