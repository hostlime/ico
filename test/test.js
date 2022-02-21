const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe.only("Checking ICO contract", function () {
  let ico;

  // создаём экземпляры контракта
  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const ICO = await ethers.getContractFactory("icoTokenTTT");
    ico = await ICO.deploy();
    await ico.deployed();
  });

  describe("Deployment", function () {
    // проверка, что контракт задеплоен
    it("Check! a contract is deployed", () => {
      console.log("contract address = '%s'", ico.address);
      assert(ico.address);
    });

    // проверка, что контракт создан овнером
    it("Check! contract creater is an owner", async function () {
      expect(await ico.owner()).to.equal(owner.address);
    });

    // проверка, что вся эмиссия у овнера
    it("Check! Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await ico.balanceOf(owner.address);
      expect(await ico.totalSupply()).to.equal(ownerBalance);
    });
  });
  describe("Transactions", function () {
    describe("Check! function transfer(_to, _value)", function () {
      describe("before the sale", function () {
        it("Check! (regular user).transfer(...) => Permission denied", async function () {
          // Transfer 50 tokens from owner to addr1
          await ico.transfer(addr1.address, 50);
          await expect(
            ico.connect(addr1).transfer(addr2.address, 50)
          ).to.be.revertedWith("Permission denied");
        });
        it("Check! (WhileList user).transfer(...) => OK", async function () {
          // Transfer 50 tokens from owner to addr1
          await ico.transfer(addr1.address, 50);
          // Добавляем пользователя addr1 в WhiteList
          await ico.addWhiteList(addr1.address);
          // теперь переводим от addr1 к addr2 во время сейла
          await ico.connect(addr1).transfer(addr2.address, 50);
          // Проверяем баланс addr2
          const addr2Balance = await ico.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });
      });
      describe("during the sale", function () {
        it("Check! (regular user).transfer(...) => Permission denied", async function () {
          // Смещаем время на 2 дня после деплоя
          const doubleDays = 2 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [doubleDays]);
          await ethers.provider.send("evm_mine");

          // Transfer 50 tokens from owner to addr1
          await ico.transfer(addr1.address, 50);
          await expect(
            ico.connect(addr1).transfer(addr2.address, 50)
          ).to.be.revertedWith("Permission denied");
        });
        it("Check! (WhileList user).transfer(...) => OK", async function () {
          // Transfer 50 tokens from owner to addr1
          await ico.transfer(addr1.address, 50);
          // Добавляем пользователя addr1 в WhiteList
          await ico.addWhiteList(addr1.address);
          // теперь переводим от addr1 к addr2 во время сейла
          await ico.connect(addr1).transfer(addr2.address, 50);
          // Проверяем баланс addr2
          const addr2Balance = await ico.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });
      });
      describe("after the sale (two months later)", function () {
        it("Check! (regular user).transfer(...) => OK", async function () {
          // Transfer 50 tokens from owner to addr1
          await ico.transfer(addr1.address, 50);

          // Смещаем время на 2 месяца
          const doubleMonth = 2 * 30 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [doubleMonth]);
          await ethers.provider.send("evm_mine");

          // теперь переводим от addr1 к addr2 во время сейла
          await ico.connect(addr1).transfer(addr2.address, 50);
          // Проверяем баланс addr2
          const addr2Balance = await ico.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });
        it("Check! (WhileList user).transfer(...) => OK", async function () {
          // Transfer 50 tokens from owner to addr1
          await ico.transfer(addr1.address, 50);
          // Добавляем пользователя addr1 в WhiteList
          await ico.addWhiteList(addr1.address);

          // Смещаем время на 2 месяца
          const doubleMonth = 2 * 30 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [doubleMonth]);
          await ethers.provider.send("evm_mine");

          // теперь переводим от addr1 к addr2 во время сейла
          await ico.connect(addr1).transfer(addr2.address, 50);
          // Проверяем баланс addr2
          const addr2Balance = await ico.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });
      });
    });

    describe("Check! buy token", function () {
      describe("before the sale", function () {
        it("Check! (regular user) send 1 eth => Sale is not available at the moment.", async function () {
          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // отправляем эфир на контракт
          await expect(addr1.sendTransaction(tx_buy)).to.be.revertedWith(
            "Sale is not available at the moment."
          );
        });
        it("Check! (WhileList user) send (value=1eth) => Sale is not available at the moment.", async function () {
          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // отправляем эфир на контракт
          await expect(addr1.sendTransaction(tx_buy)).to.be.revertedWith(
            "Sale is not available at the moment."
          );
        });
      });
      describe("during the sale", function () {
        it("Check! (regular user) send (value=1eth) => OK, 42 TTT", async function () {
          // Смещаем время на 2 дня после деплоя
          const doubleDays = 2 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [doubleDays]);
          await ethers.provider.send("evm_mine");

          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // Отправляем эфир на контракт
          await addr1.sendTransaction(tx_buy);

          // Проверяем баланс
          const addr1Balance = await ico.balanceOf(addr1.address);

          // в данный момент должно быть так 1 ETH = 42 TTT токена
          expect(addr1Balance).to.equal(ethers.utils.parseEther("42"));
        });
        it("Check! (WhileList user) send (value=1eth) => OK, 42 TTT", async function () {
          // Смещаем время на 2 дня после деплоя
          const doubleDays = 2 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [doubleDays]);
          await ethers.provider.send("evm_mine");

          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // Отправляем эфир на контракт
          await addr1.sendTransaction(tx_buy);

          // Проверяем баланс
          const addr1Balance = await ico.balanceOf(addr1.address);

          // в данный момент должно быть так 1 ETH = 42 TTT токена
          expect(addr1Balance).to.equal(ethers.utils.parseEther("42"));
        });
      });
      describe("after the sale (two months later)", function () {
        it("Check! (regular user) send (value=1eth) => Sale is not available at the moment.", async function () {
          // Смещаем время на 2 месяца
          const doubleMonth = 2 * 30 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [doubleMonth]);
          await ethers.provider.send("evm_mine");

          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // отправляем эфир на контракт
          await expect(addr1.sendTransaction(tx_buy)).to.be.revertedWith(
            "Sale is not available at the moment."
          );
        });
        it("Check! (WhileList user) send (value=1eth) => Sale is not available at the moment.", async function () {
          // Смещаем время на 2 месяца
          const doubleMonth = 2 * 30 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [doubleMonth]);
          await ethers.provider.send("evm_mine");

          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // отправляем эфир на контракт
          await expect(addr1.sendTransaction(tx_buy)).to.be.revertedWith(
            "Sale is not available at the moment."
          );
        });
      });
      describe("Raund sale", function () {
        it("Check! buy after 1 day OK, 1 eth => 42 TTT", async function () {
          // Смещаем время на 1 дня после деплоя
          const Days = 1 * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [Days]);
          await ethers.provider.send("evm_mine");

          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // Отправляем эфир на контракт
          await addr1.sendTransaction(tx_buy);

          // Проверяем баланс
          const addr1Balance = await ico.balanceOf(addr1.address);

          // в данный момент должно быть так 1 ETH = 42 TTT токена
          expect(addr1Balance).to.equal(ethers.utils.parseEther("42"));
        });
        it("Check! buy after 4 day OK, 1 eth => 21 TTT", async function () {
          // Смещаем время на 3 дней после деплоя
          const Days = (1 + 3) * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [Days]);
          await ethers.provider.send("evm_mine");

          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // Отправляем эфир на контракт
          await addr1.sendTransaction(tx_buy);

          // Проверяем баланс
          const addr1Balance = await ico.balanceOf(addr1.address);

          // в данный момент должно быть так 1 ETH = 21 TTT токена
          expect(addr1Balance).to.equal(ethers.utils.parseEther("21"));
        });
        it("Check! buy after 34 day OK, 1 eth => 8 TTT", async function () {
          // Смещаем время на 34 дней после деплоя
          const Days = (1 + 3 + 30) * 24 * 60 * 60;
          await ethers.provider.send("evm_increaseTime", [Days]);
          await ethers.provider.send("evm_mine");

          tx_buy = {
            to: ico.address,
            value: ethers.utils.parseEther("1"),
          };

          // Отправляем эфир на контракт
          await addr1.sendTransaction(tx_buy);

          // Проверяем баланс
          const addr1Balance = await ico.balanceOf(addr1.address);

          // в данный момент должно быть так 1 ETH = 21 TTT токена
          expect(addr1Balance).to.equal(ethers.utils.parseEther("8"));
        });
      });
    });

    it("Should transfer tokens between accounts", async function () {
      await ico.transfer(addr1.address, 50);
      const addr1Balance = await ico.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens => ERC20: transfer amount exceeds balance", async function () {
      // Смещаем время на 100 дней после деплоя
      const Days = 100 * 24 * 60 * 60;
      await ethers.provider.send("evm_increaseTime", [Days]);
      await ethers.provider.send("evm_mine");

      await ico.transfer(addr1.address, 50);

      // Попытаемся перевести больше чем доступно
      await expect(
        ico.connect(addr1).transfer(addr2.address, 51)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await ico.balanceOf(owner.address);

      // Смещаем время на 100 дней после деплоя
      const Days = 100 * 24 * 60 * 60;
      await ethers.provider.send("evm_increaseTime", [Days]);
      await ethers.provider.send("evm_mine");

      // Transfer 100 tokens from owner to addr1.
      await ico.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await ico.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await ico.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await ico.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await ico.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
    it("function withdrawBalance(_user)", async function () {
      // Смещаем время на 2 дня после деплоя
      const doubleDays = 2 * 24 * 60 * 60;
      await ethers.provider.send("evm_increaseTime", [doubleDays]);
      await ethers.provider.send("evm_mine");

      tx_buy = {
        to: ico.address,
        value: ethers.utils.parseEther("1"),
      };

      // Отправляем эфир на контракт
      await addr1.sendTransaction(tx_buy);
      await owner.sendTransaction(tx_buy);

      // Теперь в контракте должно быть 2
      expect(await ethers.provider.getBalance(ico.address)).to.equal(
        await ethers.utils.parseEther("2")
      );

      // Выводим все средства с контракта на addr2
      await ico.connect(owner).withdrawBalance(addr2.address);

      // Теперь в контракте должно быть 0
      expect(await ethers.provider.getBalance(ico.address)).to.equal(
        await ethers.utils.parseEther("0")
      );

      // Теперь у addr2 должно быть 10002
      expect(await ethers.provider.getBalance(addr2.address)).to.equal(
        await ethers.utils.parseEther("10002")
      );
    });
  });
});
