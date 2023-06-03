
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice simple ERC Token to demonstrat stablecoin usage. Does NOT implement stablecoin algorithms.
 * @notice NOT FOR PRODUCTION USE
 * @dev this will inheri the interface as describe in https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20
 * @dev 1 STC has 18 decimal places.
 */

contract YoutubeCoin is ERC20 {

    address private _owner;

  // TODO implemenet SimpleStableCoin contract.
    constructor() ERC20("YoutubeCoin", "YTC") {
        _owner = msg.sender;
        _mint(_owner, 1000000000000000000000000000);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(amount <= balanceOf(msg.sender), "ERC20: transfer amount exceeds balance");
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some ether");
        uint256 tokens = msg.value * 1000;
        _transfer(_owner, msg.sender, tokens);
    }

    function getBalance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }
}
