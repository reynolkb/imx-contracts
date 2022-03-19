const { expect } = require('chai');
const { ethers } = require('ethers');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const name = process.env.CONTRACT_NAME;
const symbol = process.env.CONTRACT_SYMBOL;
const imxAddress = process.env.IMX_ADDRESS;
const baseURI = process.env.BASE_URI;

describe('SupernovasRopsten', function () {
	// basic test to return name and symbol that is entered
	it('Should return the right name and symbol', async function () {
		const [owner] = await hre.ethers.getSigners();
		const o = owner.address;

		const SupernovasRopsten = await hre.ethers.getContractFactory('SupernovasRopsten');
		const supernovasRopsten = await SupernovasRopsten.deploy(o, name, symbol, imxAddress, baseURI);

		await supernovasRopsten.deployed();

		expect(await supernovasRopsten.name()).to.equal(name);
		expect(await supernovasRopsten.owner()).to.equal(o);
		expect(await supernovasRopsten.symbol()).to.equal(symbol);
		expect(await supernovasRopsten.imx()).to.equal(imxAddress);
		expect(await supernovasRopsten.baseURI()).to.equal(baseURI);
	});

	// total supply should reflect 1 after token is minted and withdrawn from L2 to L1
	it('Should be able to mint successfully with a valid blueprint', async function () {
		const [owner] = await hre.ethers.getSigners();
		const o = owner.address;

		const SupernovasRopsten = await hre.ethers.getContractFactory('SupernovasRopsten');
		const supernovasRopsten = await SupernovasRopsten.deploy(o, name, symbol, imxAddress, baseURI);

		await supernovasRopsten.deployed();

		const tokenID = '1';
		const blueprint = '1000';
		const blob = toHex(`{${tokenID}}:{${blueprint}}`);

		await supernovasRopsten.mintFor(owner.address, 1, blob);

		expect(await supernovasRopsten.totalSupply()).to.equal('1');
	});

	// tokenURI should be correct after token is minted and withdrawn from L2 to L1
	it('Should be able to mint successfully with a valid blueprint', async function () {
		const [owner] = await hre.ethers.getSigners();
		const o = owner.address;

		const SupernovasRopsten = await hre.ethers.getContractFactory('SupernovasRopsten');
		const supernovasRopsten = await SupernovasRopsten.deploy(o, name, symbol, imxAddress, baseURI);

		await supernovasRopsten.deployed();

		const tokenID = '1';
		const blueprint = '1000';
		const blob = toHex(`{${tokenID}}:{${blueprint}}`);

		await supernovasRopsten.mintFor(owner.address, 1, blob);

		expect(await supernovasRopsten.tokenURI('1')).to.equal('https://supernovas.app/api/v0/imx/metadata/1');
	});

	// mint successfully with a valid blueprint. this happens when withdrawing from L2 to L1
	it('Should be able to mint successfully with a valid blueprint', async function () {
		const [owner] = await hre.ethers.getSigners();
		const o = owner.address;

		const SupernovasRopsten = await hre.ethers.getContractFactory('SupernovasRopsten');
		const supernovasRopsten = await SupernovasRopsten.deploy(o, name, symbol, imxAddress, baseURI);

		await supernovasRopsten.deployed();

		const tokenID = '1';
		const blueprint = '1000';
		const blob = toHex(`{${tokenID}}:{${blueprint}}`);

		await supernovasRopsten.mintFor(owner.address, 1, blob);

		const oo = await supernovasRopsten.ownerOf(tokenID);

		expect(oo).to.equal(owner.address);

		const bp = await supernovasRopsten.blueprints(tokenID);

		expect(fromHex(bp)).to.equal(blueprint);
	});

	// mint successfully with an empty blueprint
	it('Should be able to mint successfully with an empty blueprint', async function () {
		const [owner] = await hre.ethers.getSigners();
		const o = owner.address;

		const SupernovasRopsten = await hre.ethers.getContractFactory('SupernovasRopsten');
		const supernovasRopsten = await SupernovasRopsten.deploy(o, name, symbol, imxAddress, baseURI);

		await supernovasRopsten.deployed();

		const tokenID = '1';
		const blueprint = '';
		const blob = toHex(`{${tokenID}}:{${blueprint}}`);

		await supernovasRopsten.mintFor(owner.address, 1, blob);

		const bp = await supernovasRopsten.blueprints(tokenID);

		expect(fromHex(bp)).to.equal(blueprint);
	});

	// mint should fail with an invalid blueprint
	it('Should not be able to mint successfully with an invalid blueprint', async function () {
		const [owner] = await hre.ethers.getSigners();
		const o = owner.address;

		const SupernovasRopsten = await hre.ethers.getContractFactory('SupernovasRopsten');
		const supernovasRopsten = await SupernovasRopsten.deploy(o, name, symbol, imxAddress, baseURI);

		await supernovasRopsten.deployed();

		const blob = toHex(`:`);
		await expect(supernovasRopsten.mintFor(owner.address, 1, blob)).to.be.reverted;
	});
});

function toHex(str) {
	let result = '';
	for (let i = 0; i < str.length; i++) {
		result += str.charCodeAt(i).toString(16);
	}
	return '0x' + result;
}

function fromHex(str1) {
	let hex = str1.toString().substr(2);
	let str = '';
	for (let n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}
