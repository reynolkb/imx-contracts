import { ethers, hardhatArguments, run } from "hardhat";
import { Mintable__factory } from "../artifacts/typechain"

function getMintingBlob(tokenId: number, blueprint: string) {
  return ethers.utils.toUtf8Bytes(`{${tokenId.toString()}}:{${blueprint}`);
}

async function main() {
    const address = '0xd7fbaec7ef46654974afd3545ddc28510367cbc2';
    const [wallet] = await ethers.getSigners();
    const contract = Mintable__factory.connect(address, wallet)

    if (!hardhatArguments.network) {
        throw new Error("please pass --network");
    }

    const tokenId = 250;
    const mintingBlob = getMintingBlob(tokenId, 'test');

    const result = await contract.mintFor(address, 1, mintingBlob);
    console.log(result);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
