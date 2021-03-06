# Deployed Etherscan Address

[https://etherscan.io/address/0x154c512B8A52FDC13C36BbFB36d909C3bC814bc1#code](https://etherscan.io/address/0x154c512B8A52FDC13C36BbFB36d909C3bC814bc1#code)

# Immutable X Contracts

Installation: `npm install @imtbl/imx-contracts` or `yarn add @imtbl/imx-contracts`.

| Name         | Public Test (Ropsten)                                                                                                         | Production (Mainnet)                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Core         | [0x4527be8f31e2ebfbef4fcaddb5a17447b27d2aef](https://ropsten.etherscan.io/address/0x4527be8f31e2ebfbef4fcaddb5a17447b27d2aef) | [0x5FDCCA53617f4d2b9134B29090C87D01058e27e9](https://etherscan.io/address/0x5FDCCA53617f4d2b9134B29090C87D01058e27e9) |
| Registration | [0x68e6217A0989c5e2CBa95142Ada69bA1cE2cdCA9](https://ropsten.etherscan.io/address/0x68e6217A0989c5e2CBa95142Ada69bA1cE2cdCA9) | [0xB28816338Bcc7Eb4dC1e0c09341076Db0b97f92F](https://etherscan.io/address/0xB28816338Bcc7Eb4dC1e0c09341076Db0b97f92F) |

# L2 Minting

Immutable X is the only NFT scaling protocol that supports minting assets on L2, and having those assets be trustlessly withdrawable to Ethereum L1. To enable this, before you can mint on L2, you need to deploy an IMX-compatible ERC721 contract as the potential L1 home for these assets. Luckily, making an ERC721 contract IMX-compatible is easy!

### No Code Usage (Test Environment Only)

In the test environment, deploying an ERC721 contract which is compatible with Immutable X is extremely easy. First, update the `.env` file, setting:

-   `CONTRACT_OWNER_ADDRESS`
-   `CONTRACT_NAME`
-   `CONTRACT_SYMBOL`
-   `ETHERSCAN_API_KEY`
    -   which can be obtained from [your Etherscan account.](https://etherscan.io/myapikey)

Then, just run `yarn hardhat run deploy/asset.ts --network ropsten`.
Ropsten Deployed Contract Address: `0x22748CF926C0C4169Cc4202AC8e68710D7262D1A`

### Basic Usage

If you're starting from scratch, simply deploy a new instance of `Asset.sol` and you'll have an L2-mintable ERC721 contract. Set the `_imx` parameter in the contract constructor to either the `Public Test` or `Production` addresses as above.

If you already have an ERC721 contract written, simply add `Mintable.sol` as an ancestor, implement the `_mintFor` function with your internal mint function, and set up the constructor as above:

```
import "@imtbl/imx-contracts/contracts/Mintable.sol";

contract YourContract is Mintable {

    constructor(address _imx) Mintable(_imx) {}

    function _mintFor(
        address to,
        uint256 id,
        bytes calldata blueprint
    ) internal override {
        // TODO: mint the token using your existing implementation
    }

}
```

### Advanced Usage

To enable L2 minting, your contract must implement the `IMintable.sol` interface with a function which mints the corresponding L1 NFT. This function is `mintFor(address to, uint256 quantity, bytes mintingBlob)`. Note that this is a different function signature to `_mintFor` in the previous example. The "blueprint" is the immutable metadata set by the minting application at the time of asset creation. This blueprint can store the IPFS hash of the asset, or some of the asset's properties, or anything a minting application deems valuable. You can use a custom implementation of the `mintFor` function to do whatever you like with the blueprint.

Your contract also needs to have an `owner()` function which returns an `address`. You must be able to sign a message with this address, which is used to link this contract your off-chain application (so you can authorise L2 mints). A simple way to do this is using the OpenZeppelin `Ownable` contract (`npm install @openzeppelin/contracts`).

```
import "@imtbl/imx-contracts/contracts/Mintable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourContract is IMintable, Ownable {

    function mintFor(
        address to,
        uint256 quantity,
        bytes calldata mintingBlob
    ) external override {
        // TODO: make sure only Immutable X can call this function
        // TODO: mint the token!
    }

}
```

### Manually verifying registration contract

Verification with Etherscan should happen automatically within a few minutes of contract deployment, but if it fails you can run it manually, eg

```
yarn hardhat verify --network <network> <address> <args used in deployment>
```

### Generating Typescript Types

Run `yarn compile`. The output can be found in the `artifacts/typechain` folder.
