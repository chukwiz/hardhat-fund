// Get funds
// withdraw funds
// set a minimum funding value in usd

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./PriceConverter.sol";

error FundMe__NotOwner();

// interfaces, libraries

/// @title Contract for crowdfunding
/// @author Wyma
/// @notice This contract is a demo contract
/// @dev This implements price feeds as our library


contract FundMe {
    // type Declarations
    using PriceConverter for uint256;

    // state variables
    uint256 public constant MIN_USD = 50 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    address private immutable i_owner;
    AggregatorV3Interface public s_priceFeed;

    // Events
    // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner");
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Functions

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(msg.value.getEthToUSD(s_priceFeed) >= MIN_USD, "You need to spend more eth");
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 funderIndex; funderIndex < s_funders.length; funderIndex++) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        // funds withdrawal

        // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send Failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    function getOwner() public view returns(address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns(address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder) public view returns(uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns(AggregatorV3Interface) {
        return s_priceFeed;
    }
}
