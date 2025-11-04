export const contracts = {
  polygonAmoy: {
    questContract: {
      address: (process.env.NEXT_PUBLIC_POLYGON_QUEST_CONTRACT || '0x') as `0x${string}`,
      abi: [
        {
          "inputs": [{"internalType": "uint256", "name": "_questId", "type": "uint256"}],
          "name": "completeQuest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "address", "name": "_player", "type": "address"}],
          "name": "getPlayerQuestCount",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "name": "quests",
          "outputs": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "uint256", "name": "rewardAmount", "type": "uint256"},
            {"internalType": "bool", "name": "active", "type": "bool"}
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
            {"indexed": true, "internalType": "uint256", "name": "questId", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
          ],
          "name": "QuestCompleted",
          "type": "event"
        }
      ] as const,
    },
  },
  sepolia: {
    achievementNFT: {
      address: (process.env.NEXT_PUBLIC_ETHEREUM_ACHIEVEMENT_NFT || '0x') as `0x${string}`,
      abi: [
        {
          "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalMinted",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }
      ] as const,
    },
  },
  bscTestnet: {
    rewardToken: {
      address: (process.env.NEXT_PUBLIC_BNB_REWARD_TOKEN || '0x') as `0x${string}`,
      abi: [
        {
          "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }
      ] as const,
    },
  },
  arbitrumSepolia: {
    badgeTracker: {
      address: (process.env.NEXT_PUBLIC_ARBITRUM_BADGE_TRACKER || '0x') as `0x${string}`,
      abi: [
        {
          "inputs": [{"internalType": "address", "name": "_player", "type": "address"}],
          "name": "getPlayerBadges",
          "outputs": [
            {"internalType": "uint256", "name": "total", "type": "uint256"},
            {"internalType": "uint256", "name": "bronze", "type": "uint256"},
            {"internalType": "uint256", "name": "silver", "type": "uint256"},
            {"internalType": "uint256", "name": "gold", "type": "uint256"},
            {"internalType": "uint256", "name": "lastUpdate", "type": "uint256"}
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ] as const,
    },
  },
};

export const chainExplorers = {
  80002: 'https://amoy.polygonscan.com',
  11155111: 'https://sepolia.etherscan.io',
  97: 'https://testnet.bscscan.com',
  421614: 'https://sepolia.arbiscan.io',
};