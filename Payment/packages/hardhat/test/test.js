const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const provider = ethers.provider;
    const [owner, user1, user2, user3, user4, user5, user6] =
      await ethers.getSigners();
    const Pay = await ethers.getContractFactory("Pay");
    const pay = await Pay.deploy();
    await pay.deployed();

    await pay.createSplit(
      ethers.utils.parseEther("100"),
      "Food",
      [user1.address, user2.address, user3.address],
      [
        ethers.utils.parseEther("10"),
        ethers.utils.parseEther("20"),
        ethers.utils.parseEther("70"),
      ],
      owner.address
    );
    console.log("user1", await pay.SplitStats(0, user2.address));
    console.log("balane", await provider.getBalance(owner.address));
    await pay.connect(user1).acceptOrRejectSplit(true, 0);
    await pay.connect(user2).acceptOrRejectSplit(true, 0);
    // await pay.connect(user3).acceptOrRejectSplit(true, 0);

    console.log(await pay.fetchMySplits());

    console.log("req", await pay.getRequests(user3.address));

    await pay.setUsername("Josh");
    await pay.setUsername("Josh1");
    await pay.setUsername("Josh");
    await pay.createGroup(
      [user1.address, user2.address, user3.address],
      "group1"
    );

    await pay
      .connect(user1)
      .createGroup([user3.address, user4.address, user5.address], "Group2");

    console.log(await pay.getAddress("JOSH2"));
    console.log(await pay.getAddress("josh"));
    console.log(
      await pay.getUsername("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    );

    console.log(await pay.getSplitData(0));

    //console.log(await pay.fetchMyGroup());
    //console.log(await pay.fetchNameGroup("group1"));
    //console.log(await pay.connect(user1).fetchNameGroup("group1"));

    //expect(await greeter.greet()).to.equal("Hello, world!");

    //const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    //await setGreetingTx.wait();

    //expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
