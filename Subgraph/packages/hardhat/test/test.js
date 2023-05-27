const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [owner, user1, user2, user3, user4, user5, user6] =
      await ethers.getSigners();
    const Task = await ethers.getContractFactory("TaskStorage");
    const task = await Task.deploy();
    await task.deployed();

    const t = await task.createTask("name", 100);
    const t2 = await task.getTask(owner.address);

    console.log(t2);
  });
});
