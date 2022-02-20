// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract icoTokenTTT is ERC20, Ownable {

    mapping (address => bool)  internal whiteList;

    uint internal scale                   =   1 days; // 1 days

    uint internal startTimeSale           =   block.timestamp + scale;
    uint internal endFistPeriodSale       =  startTimeSale + 3 * scale; 
    uint internal endSecondPeriodSale     =  endFistPeriodSale + 30 * scale; 
    uint internal endTimeSale             =  endSecondPeriodSale + 14 * scale;

    uint internal firstPeriodRate         =  42;
    uint internal secondPeriodRate        =  21;
    uint internal thirdPeriodRate         =  8;

    // Сейл сейчас активен?
    modifier isSaleAvailable {
        require(
            (block.timestamp >= startTimeSale) && 
            (block.timestamp <= endTimeSale)
            , "Sale is not available at the moment.");
        _;
    }
    constructor() ERC20("TokenTTT", "TTT") {
        _mint(msg.sender, 1000_000 * 10 ** decimals());
        addWhiteList(owner());
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
    
    function addWhiteList(address _user) public onlyOwner {
        whiteList[_user] = true; 
    }

    function getCostToken() public view returns(uint){
        if( block.timestamp <= endFistPeriodSale) return firstPeriodRate;
        if( block.timestamp <= endSecondPeriodSale) return secondPeriodRate;
        if( block.timestamp <= endTimeSale) return thirdPeriodRate;
        return thirdPeriodRate;
    }

    receive() external payable{
        buy();
    }

    function buy() public payable isSaleAvailable {
        
      require(msg.sender.balance >= msg.value && msg.value != 0 ether, "ICO: function buy invalid input");
 
      uint256 amount = msg.value * getCostToken();
      _transfer(owner(), _msgSender(), amount);
    }

  function transfer(address _to, uint256 _value) public override returns (bool) {
        // Разрешаем передачу только после завершения сейла ИЛИ для whiteList[]
        require(
            (block.timestamp > endTimeSale)||
            (whiteList[msg.sender] == true), 
            "Permission denied");

        return super.transfer(_to, _value);
    }

    function withdrawBalance(address payable _user) public payable onlyOwner{
        _user.transfer(address(this).balance);
    }

}