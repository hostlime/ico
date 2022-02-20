# ICO смарт-контракт токена ERC20 (TTT)
Смарт-контракт токена ERC20 (TTT) на Solidity. Операция перевод (transfer) до некоторой даты (окончания ICO) доступна только пользователям из вайтлиста . Вайтлист может пополнять
только владелец контракта.

### ICO смарт-контракт с тремя периодами покупки
- первый период, длительностью 3 дня: 1 ETH = 42 TTT токена;
- второй период, длительностью 1 месяц: 1 ETH = 21 TTT токен
- третий период, длительностью 2 недели: 1 ETH = 8 TTT токенов.

### Юнит тесты  в Donation.js (npx hardhat test)
```
npx hardhat test
  Checking ICO contract
    Deployment
contract address = '0x8db93dd36301f6de776fc746060a658c3aa6a314'
      √ Check! a contract is deployed
      √ Check! contract creater is an owner
      √ Check! Should assign the total supply of tokens to the owner
    Transactions
      √ Should transfer tokens between accounts
      √ Should fail if sender doesn’t have enough tokens => ERC20: transfer amount exceeds balance (100ms)
      √ Should update balances after transfers (105ms)
      √ function withdrawBalance(_user) (279ms)
      Check! function transfer(_to, _value)
        before the sale
          √ Check! (regular user).transfer(...) => Permission denied (56ms)
          √ Check! (WhileList user).transfer(...) => OK (83ms)
        during the sale
          √ Check! (regular user).transfer(...) => Permission denied (51ms)
          √ Check! (WhileList user).transfer(...) => OK (75ms)
        after the sale (two months later)
          √ Check! (regular user).transfer(...) => OK (54ms)
          √ Check! (WhileList user).transfer(...) => OK (91ms)
      Check! buy token
        before the sale
          √ Check! (regular user) send 1 eth => Sale is not available at the moment.
          √ Check! (WhileList user) send (value=1eth) => Sale is not available at the moment.
        during the sale
          √ Check! (regular user) send (value=1eth) => OK, 42 TTT (52ms)
          √ Check! (WhileList user) send (value=1eth) => OK, 42 TTT (59ms)
        after the sale (two months later)
          √ Check! (regular user) send (value=1eth) => Sale is not available at the moment.
          √ Check! (WhileList user) send (value=1eth) => Sale is not available at the moment.
        Raund sale
          √ Check! buy after 1 day OK, 1 eth => 42 TTT (50ms)
          √ Check! buy after 4 day OK, 1 eth => 21 TTT (55ms)
          √ Check! buy after 34 day OK, 1 eth => 8 TTT (55ms)
```

+ Контракт в сети Rinkeby:  https://rinkeby.etherscan.io/address/0x8db93dd36301f6de776fc746060a658c3aa6a314
