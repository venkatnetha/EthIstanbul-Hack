const { ethers } = require('hardhat');
const { assert, expect,assertReverts } = require("chai")


require("@nomiclabs/hardhat-waffle");


describe('NextMillionaire', () => {
  let NextMillionaire;
  let users;
  let owner, user;
  let tx;

  beforeEach('identify signers', async () => {
    users = await ethers.getSigners();    
    [owner, user] = users;
  });

  beforeEach('deploy lottery contract', async () => {
    let Lottery = await ethers.getContractFactory('NextMillionaire');
    lottery = await Lottery.deploy();
    await lottery.deployed();
  });

  describe("startLottery", () => {
    it('reverts if Lottery state was not in CLOSED state', async () => {
      await lottery.startLottery();
      await assert(lottery.startLottery(), "Lottery is running,check back later");
    });

    it('state becomes OPEN when start lottery is called', async () => {
      await lottery.startLottery();
      const currentlotterystate = await lottery.lotteryState();
      expect(currentlotterystate).to.equal(0);
    });

  });

  
  describe("registerForLottery", () => {    
    it("reverts when you don't pay enough", async () => {
      tx = await lottery.startLottery();
      const entranceFee = await lottery.entryFee();
      await expect(lottery.registerForLottery({ value: entranceFee.sub(1) })).to.be.revertedWith(
            "Value sent is not equal to entryFee - 1 ether"
        )
    });

    it('user enters lottery when amount greater than required fee', async () => {
      tx = await lottery.startLottery();
      const entranceFee = await lottery.entryFee();
      await expect(lottery.registerForLottery({ value: entranceFee.add(1) })).to.emit(
        lottery,
        "PlayerJoined"
        )
    });

    it("emits event on enter", async () => {
      tx = await lottery.startLottery();
      const entranceFee = await lottery.entryFee();
      await expect(lottery.registerForLottery({ value: entranceFee })).to.emit(
        lottery,
        "PlayerJoined"
        )
    });
  });


  describe('when owner ends the lottery', () => {
    it('reverts if Not enough LINK tokens present in the account', async () => {      
        const currentlotterystate = await lottery.lotteryState();             
        await expect(lottery.pickWinner()).to.be.revertedWith(
            "Not in correct state"
        )
    });

  });
});
