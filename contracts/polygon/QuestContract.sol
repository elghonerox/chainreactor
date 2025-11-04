// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QuestContract
 * @dev Main quest completion tracker on Polygon Amoy
 */
contract QuestContract is Ownable {
    struct Quest {
        string name;
        uint256 rewardAmount;
        bool active;
    }

    struct PlayerProgress {
        uint256 completedQuests;
        mapping(uint256 => bool) questCompleted;
    }

    mapping(uint256 => Quest) public quests;
    mapping(address => PlayerProgress) public playerProgress;
    
    uint256 public questCount;

    event QuestCompleted(
        address indexed player,
        uint256 indexed questId,
        uint256 timestamp
    );

    event QuestCreated(
        uint256 indexed questId,
        string name,
        uint256 rewardAmount
    );

    constructor() Ownable(msg.sender) {
        // Create initial quests
        createQuest("Collect 5 Items", 100);
        createQuest("Defeat 10 Enemies", 200);
        createQuest("Explore 3 Regions", 150);
    }

    /**
     * @dev Create a new quest (admin only)
     */
    function createQuest(string memory _name, uint256 _rewardAmount) public onlyOwner {
        questCount++;
        quests[questCount] = Quest({
            name: _name,
            rewardAmount: _rewardAmount,
            active: true
        });

        emit QuestCreated(questCount, _name, _rewardAmount);
    }

    /**
     * @dev Complete a quest - triggers Kwala workflow
     */
    function completeQuest(uint256 _questId) external {
        require(_questId > 0 && _questId <= questCount, "Invalid quest ID");
        require(quests[_questId].active, "Quest not active");
        require(!playerProgress[msg.sender].questCompleted[_questId], "Quest already completed");

        playerProgress[msg.sender].questCompleted[_questId] = true;
        playerProgress[msg.sender].completedQuests++;

        emit QuestCompleted(msg.sender, _questId, block.timestamp);
    }

    /**
     * @dev Get player's total completed quests (for cross-chain reading)
     */
    function getPlayerQuestCount(address _player) external view returns (uint256) {
        return playerProgress[_player].completedQuests;
    }

    /**
     * @dev Check if player completed specific quest
     */
    function hasCompletedQuest(address _player, uint256 _questId) external view returns (bool) {
        return playerProgress[_player].questCompleted[_questId];
    }

    /**
     * @dev Toggle quest active status
     */
    function setQuestActive(uint256 _questId, bool _active) external onlyOwner {
        require(_questId > 0 && _questId <= questCount, "Invalid quest ID");
        quests[_questId].active = _active;
    }
}