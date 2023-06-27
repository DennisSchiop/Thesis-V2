// SPDX-License-Identifier: UNLICENSED


pragma solidity ^0.8.0;

contract QrStore {
    mapping(address => string) public qrData;

    function storeQrData(string calldata data) external {
        qrData[msg.sender] = data;
    }

    function getQrData(address user) external view returns (string memory) {
        return qrData[user];
    }
}