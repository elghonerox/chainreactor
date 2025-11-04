// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BadgeTracker
 * @dev Tracks player badges and achievements on Arbitrum
 */
contract BadgeTracker is Ownable {
    struct PlayerBadges {
        uint256 totalBadges;
        uint256 bronzeBadges;
        uint256 silverBadges;
        uint256 goldBadges;
        uint256 lastUpdated;
    }

    mapping(address => PlayerBadges) public playerBadges;

    event BadgeUpdated(
        address indexed player,
        uint256 totalBadges,
        uint256 timestamp
    );

    event SpecialBadgeAwarded(
        address indexed player,
        string badgeType,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Increment player's badge count (called by Kwala)
     */
    function incrementBadgeCount(address _player) external onlyOwner {
        playerBadges[_player].totalBadges++;
        playerBadges[_player].lastUpdated = block.timestamp;

        emit BadgeUpdated(_player, playerBadges[_player].totalBadges, block.timestamp);
    }

    /**
     * @dev Award specific badge type
     */
    function awardBadge(address _player, uint8 _badgeType) external onlyOwner {
        require(_badgeType >= 1 && _badgeType <= 3, "Invalid badge type");

        if (_badgeType == 1) {
            playerBadges[_player].bronzeBadges++;
            emit SpecialBadgeAwarded(_player, "Bronze", block.timestamp);
        } else if (_badgeType == 2) {
            playerBadges[_player].silverBadges++;
            emit SpecialBadgeAwarded(_player, "Silver", block.timestamp);
        } else {
            playerBadges[_player].goldBadges++;
            emit SpecialBadgeAwarded(_player, "Gold", block.timestamp);
        }

        playerBadges[_player].totalBadges++;
        playerBadges[_player].lastUpdated = block.timestamp;

        emit BadgeUpdated(_player, playerBadges[_player].totalBadges, block.timestamp);
    }

    /**
     * @dev Get player's badge stats
     */
    function getPlayerBadges(address _player) external view returns (
        uint256 total,
        uint256 bronze,
        uint256 silver,
        uint256 gold,
        uint256 lastUpdate
    ) {
        PlayerBadges memory badges = playerBadges[_player];
        return (
            badges.totalBadges,
            badges.bronzeBadges,
            badges.silverBadges,
            badges.goldBadges,
            badges.lastUpdated
        );
    }

    /**
     * @dev Batch update multiple players
     */
    function batchIncrementBadges(address[] calldata _players) external onlyOwner {
        for (uint256 i = 0; i < _players.length; i++) {
            playerBadges[_players[i]].totalBadges++;
            playerBadges[_players[i]].lastUpdated = block.timestamp;
            emit BadgeUpdated(_players[i], playerBadges[_players[i]].totalBadges, block.timestamp);
        }
    }
}