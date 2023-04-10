import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("Split", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, friendOne, friendTwo, ServiceProvider] = await ethers.getSigners();

        const Split = await ethers.getContractFactory("Split");
        const split = await Split.deploy();

        return { split, friendOne, friendTwo, ServiceProvider, owner };
    }

    describe("Deployment", function () {
        it("should be deployed", async function () {
            const { split } = await loadFixture(deployOneYearLockFixture);

            expect(await split.address).to.be.a('string');
        });
    });


    describe("Add Friend", function () {
        it("should add new friends and update balances accordingly", async function () {
            const { owner, split, friendOne } = await loadFixture(deployOneYearLockFixture);

            const ownerRequestRes = await split.becomeAFriend({ value: ethers.utils.parseEther("0.001") });
            console.log('\t', " 🏷 Become a Friend Result Hash: ", ownerRequestRes.hash);
            const ownerBalance = await split.checkFriendsBalance(owner.address);
            console.log('\t  💵 owner balance ', ethers.utils.formatEther(ownerBalance));
            expect(ethers.utils.formatEther(ownerBalance)).to.equal("0.001");

            const friendOneRequestRes = await split.connect(friendOne).becomeAFriend({ value: ethers.utils.parseEther("10") });
            console.log('\t', " 🏷 Become a Friend Result Hash: ", friendOneRequestRes.hash);
            const friendOneBalance = await split.checkFriendsBalance(friendOne.address);
            console.log('\t  💵 friend one balance', ethers.utils.formatEther(friendOneBalance));
            expect(ethers.utils.formatEther(friendOneBalance)).to.equal("10.0");
        });

        it("should revert is no money is send", async function () {
            const { split } = await loadFixture(deployOneYearLockFixture);

            // await expect(split.becomeAFriend()).to.be.revertedWith(
            //     "not enough funds to become a friend"
            // );
            await expect(split.becomeAFriend()).to.be.reverted;
        });
    });

    describe("Split Bill", function () {
        it("should split the bill accordingly", async function () {
            const { split, ServiceProvider, owner, friendOne, friendTwo } = await loadFixture(deployOneYearLockFixture);

            // set balance of service provider to 10
            await network.provider.send("hardhat_setBalance", [
                ServiceProvider.address.toString(),
                ethers.utils.parseUnits("10", 18).toHexString(),
            ]);

            //check initial balance of service provider - 10
            const serviceProviderBalanceBeforePayment = ethers.utils.formatEther(await ServiceProvider.getBalance());

            //fund the balances
            await split.becomeAFriend({ value: ethers.utils.parseEther("20") });
            await split.connect(friendOne).becomeAFriend({ value: ethers.utils.parseEther("10") });

            //paying
            const billAmt = 5;
            await split.payBill(ethers.utils.parseEther(billAmt.toString()), ServiceProvider.address, [owner.address, friendOne.address]);

            const serviceProviderBalanceAfterPayment = ethers.utils.formatEther(await ServiceProvider.getBalance());

            expect(Number(serviceProviderBalanceAfterPayment)).to.equal(Number(serviceProviderBalanceBeforePayment) + billAmt);
        });

        it("should update the balances of friends accordingly after paying", async function () {
            const { split, ServiceProvider, owner, friendOne, friendTwo } = await loadFixture(deployOneYearLockFixture);

            //fund the balances
            await split.becomeAFriend({ value: ethers.utils.parseEther("30") });
            await split.connect(friendOne).becomeAFriend({ value: ethers.utils.parseEther("20") });

            const billAmt = 10;
            split.payBill(ethers.utils.parseEther(billAmt.toString()), ServiceProvider.address, [owner.address, friendOne.address]);

            const ownerBalanceAfterPayment = ethers.utils.formatEther(await split.checkFriendsBalance(owner.address));
            expect(ownerBalanceAfterPayment).to.equal("25.0");

            const friendOneBalanceAfterPayment = ethers.utils.formatEther(await split.checkFriendsBalance(friendOne.address));
            expect(friendOneBalanceAfterPayment).to.equal("15.0");
        });
    });
});
