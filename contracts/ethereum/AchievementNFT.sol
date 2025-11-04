// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AchievementNFT
 * @dev Mints achievement NFTs on Ethereum when quests completed on Polygon
 */
contract AchievementNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    
    mapping(address => mapping(uint256 => bool)) public playerAchievements;
    mapping(uint256 => uint256) public tierTokenCount;
    mapping(address => mapping(uint256 => bool)) public hasClaimed;

    string public baseURI;

    event AchievementMinted(
        address indexed player,
        uint256 indexed tokenId,
        uint256 questId,
        uint256 timestamp
    );

    event TierNFTMinted(
        address indexed player,
        uint256 indexed tier,
        uint256 tokenId,
        uint256 timestamp
    );

    constructor() ERC721("ChainReactor Achievement", "CRACHT") Ownable(msg.sender) {
        baseURI = "ipfs://QmPlaceholder/";
    }

    /**
     * @dev Mint achievement NFT (called by Kwala workflow)
     */
    function mintAchievement(address _player, uint256 _questId) external onlyOwner {
        require(!playerAchievements[_player][_questId], "Achievement already minted");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(_player, newTokenId);
        playerAchievements[_player][_questId] = true;

        emit AchievementMinted(_player, newTokenId, _questId, block.timestamp);
    }

    /**
     * @dev Mint tier-based NFT (Bronze/Silver for milestones)
     */
    function mintTierNFT(address _player, uint256 _tier) external onlyOwner {
        require(_tier >= 1 && _tier <= 3, "Invalid tier");
        require(!hasClaimed[_player][_tier], "Tier already claimed");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(_player, newTokenId);
        hasClaimed[_player][_tier] = true;
        tierTokenCount[_tier]++;

        emit TierNFTMinted(_player, _tier, newTokenId, block.timestamp);
    }

    /**
     * @dev Check if player claimed specific tier
     */
    function hasClaimedTier(address _player, uint256 _tier) external view returns (bool) {
        return hasClaimed[_player][_tier];
    }

    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    /**
     * @dev Override tokenURI to return metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

    /**
     * @dev Get total achievements minted
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }
}