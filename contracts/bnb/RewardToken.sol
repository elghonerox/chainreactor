// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC20 token for quest rewards on BNB Chain
 */
contract RewardToken is ERC20, Ownable {
    event RewardClaimed(
        address indexed player,
        uint256 amount,
        uint256 timestamp
    );

    constructor() ERC20("ChainReactor Reward", "CRRT") Ownable(msg.sender) {
        // Mint initial supply to contract for distribution
        _mint(address(this), 1000000 * 10**decimals());
    }

    /**
     * @dev Transfer rewards to player (called by Kwala)
     */
    function distributeReward(address _player, uint256 _amount) external onlyOwner {
        require(balanceOf(address(this)) >= _amount, "Insufficient contract balance");
        
        _transfer(address(this), _player, _amount);
        
        emit RewardClaimed(_player, _amount, block.timestamp);
    }

    /**
     * @dev Batch transfer (future use)
     */
    function batchDistribute(address[] calldata _players, uint256[] calldata _amounts) external onlyOwner {
        require(_players.length == _amounts.length, "Array length mismatch");
        
        for (uint256 i = 0; i < _players.length; i++) {
            require(balanceOf(address(this)) >= _amounts[i], "Insufficient contract balance");
            _transfer(address(this), _players[i], _amounts[i]);
            emit RewardClaimed(_players[i], _amounts[i], block.timestamp);
        }
    }

    /**
     * @dev Allow owner to withdraw remaining tokens
     */
    function withdrawRemaining(address _to) external onlyOwner {
        uint256 remaining = balanceOf(address(this));
        _transfer(address(this), _to, remaining);
    }

    /**
     * @dev Get contract token balance
     */
    function contractBalance() external view returns (uint256) {
        return balanceOf(address(this));
    }
}