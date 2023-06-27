// SPDX-License-Identifier: UNLICENSED


pragma solidity ^0.8.0;

contract QrStore {
    // Mapping to store QR data for each address
    mapping(address => string) public qrData;

    function storeQrData(string calldata data) external {
        qrData[msg.sender] = data;
    }

    // Function to retrieve QR data for a given user address
    function getQrData(address user) external view returns (string memory) {
        return qrData[user];
    }
}