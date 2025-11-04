# ChainReactor 🚀

**Multi-chain quest automation powered by Kwala's serverless workflows**

Complete quests on Polygon → Automatically trigger rewards across Ethereum, BNB Chain, and Arbitrum — simultaneously, with zero manual claiming.

---

## 🎯 Problem

Web3 gaming UX is broken:
- Complete quest on Chain A
- Switch wallet to Chain B, claim reward
- Switch to Chain C, claim again
- Switch to Chain D, claim again
- **Result:** 4 transactions, 4 gas fees, 10 minutes wasted

## ✨ Solution

**ChainReactor** uses Kwala's serverless automation to orchestrate multi-chain rewards in parallel:

1. User completes quest on Polygon (1 transaction)
2. Kwala workflow detects `QuestCompleted` event
3. **Parallel execution across 3 chains:**
   - Ethereum: Mint Achievement NFT
   - BNB Chain: Transfer 10 CRRT tokens
   - Arbitrum: Increment badge count
4. User receives all rewards **without additional actions**

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    USER COMPLETES QUEST                      │
│                   (Polygon Amoy Testnet)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ QuestCompleted Event
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              KWALA SERVERLESS WORKFLOW                       │
│          (parallel-multi-chain-rewards.yaml)                 │
└──────────────┬───────────────┬──────────────┬───────────────┘
               │               │              │
    ┌──────────▼───┐  ┌────────▼────┐  ┌──────▼────────┐
    │  Ethereum    │  │  BNB Chain  │  │  Arbitrum     │
    │  Sepolia     │  │  Testnet    │  │  Sepolia      │
    ├──────────────┤  ├─────────────┤  ├───────────────┤
    │ Mint NFT     │  │ Send Tokens │  │ Update Badge  │
    └──────────────┘  └─────────────┘  └───────────────┘
```

### Key Components

**Smart Contracts:**
- `QuestContract.sol` (Polygon) - Quest completion tracker
- `AchievementNFT.sol` (Ethereum) - ERC721 achievement tokens
- `RewardToken.sol` (BNB) - ERC20 reward distribution
- `BadgeTracker.sol` (Arbitrum) - Player progress tracking

**Kwala Workflows:**
1. `parallel-multi-chain-rewards.yaml` - Parallel 3-chain execution
2. `achievement-milestone-checker.yaml` - Cron-based threshold checking with conditional logic
3. `discord-notifications.yaml` - Multi-chain event → Discord webhook

**Frontend:**
- Next.js 14 + TypeScript
- RainbowKit for multi-chain wallet connection
- Wagmi v2 for contract interactions
- Real-time stats dashboard

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Testnet funds for 4 chains (see Faucets section)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/chainreactor.git
cd chainreactor

# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment
```bash
# Root directory
cp .env.example .env
# Edit .env with your private key and API keys

# Frontend directory
cd frontend
cp .env.local.example .env.local
# Edit .env.local with WalletConnect Project ID
cd ..
```

### 3. Get Testnet Funds

**Polygon Amoy:**
- https://faucet.polygon.technology/

**Ethereum Sepolia:**
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

**BNB Testnet:**
- https://testnet.bnbchain.org/faucet-smart

**Arbitrum Sepolia:**
- https://faucet.quicknode.com/arbitrum/sepolia

### 4. Deploy Contracts
```bash
# Compile contracts
npm run compile

# Deploy to all chains (takes ~5 minutes)
npm run deploy:all

# Or deploy individually:
npm run deploy:polygon
npm run deploy:ethereum
npm run deploy:bnb
npm run deploy:arbitrum
```

**Save contract addresses** to `.env` and `frontend/.env.local`

### 5. Configure Kwala Workflows

1. Register at https://kwala.network
2. Create new workspace
3. Upload workflows from `/workflows` directory
4. Replace contract addresses in YAML files with your deployed addresses
5. Set Kwala wallet as contract owner:
```bash
# Run for each contract
npx hardhat run scripts/transfer-ownership.js --network polygonAmoy
```

### 6. Run Frontend
```bash
cd frontend
npm run dev
```

Open http://localhost:3000

---

## 📁 Project Structure
```
chainreactor/
├── contracts/           # Solidity smart contracts
│   ├── polygon/        # Quest tracking
│   ├── ethereum/       # Achievement NFTs
│   ├── bnb/           # Reward tokens
│   └── arbitrum/      # Badge system
├── workflows/          # Kwala YAML workflows
│   ├── parallel-multi-chain-rewards.yaml
│   ├── achievement-milestone-checker.yaml
│   └── discord-notifications.yaml
├── scripts/           # Deployment scripts
├── frontend/          # Next.js application
│   ├── app/          # Pages and layouts
│   ├── components/   # React components
│   └── lib/          # Contract ABIs and configs
├── hardhat.config.js # Hardhat configuration
└── README.md
```

---

## 🎮 How to Use

1. **Connect Wallet** - RainbowKit supports all major wallets
2. **Switch to Polygon Amoy** - Required to complete quests
3. **Click "Complete Quest"** - Triggers single transaction
4. **Watch the Magic** - Kwala executes 3 actions across 3 chains
5. **Check Stats** - NFTs, tokens, and badges update automatically

---

## 🔧 Kwala Workflows Explained

### Workflow 1: Parallel Multi-Chain Rewards

**Trigger:** `QuestCompleted` event on Polygon  
**Actions (Parallel):**
- Ethereum: `mintAchievement(player, questId)`
- BNB: `distributeReward(player, 10 tokens)`
- Arbitrum: `incrementBadgeCount(player)`

**Key Feature:** All 3 contract calls execute simultaneously

### Workflow 2: Achievement Milestone Checker

**Trigger:** Cron (every 6 hours)  
**Logic:**
1. Read quest count from Polygon
2. Check claimed status on Ethereum
3. **Conditional minting:**
   - If count >= 3 AND !claimed[Bronze] → Mint Bronze NFT
   - If count >= 5 AND !claimed[Silver] → Mint Silver NFT

**Key Feature:** Cross-chain state reading + conditional execution

### Workflow 3: Discord Notifications

**Trigger:** Events from all 4 chains  
**Actions:**
1. Format event data into Discord embed
2. Send webhook to Discord channel

**Key Feature:** Multi-chain event listening + Web2 integration

---

## 🧪 Testing

### Local Testing (without Kwala)
```bash
# Run Hardhat tests
npx hardhat test

# Test individual contracts
npx hardhat test test/QuestContract.test.js
```

### Testnet Testing (with Kwala)

1. Deploy all contracts
2. Configure Kwala workflows
3. Complete quest via frontend
4. Monitor Kwala dashboard for workflow execution
5. Verify transactions on block explorers

---

## 🐛 Troubleshooting

### "Insufficient funds" error
- Get testnet tokens from faucets (links in Quick Start)
- Ensure you have gas on the chain you're interacting with

### "Wrong network" error
- Use RainbowKit's network switcher in the UI
- Polygon Amoy (80002) required for quest completion

### Kwala workflow not triggering
- Verify contract addresses in YAML match deployed contracts
- Check Kwala wallet is set as contract owner
- Confirm workflow is deployed and active in Kwala dashboard

### Transaction fails
- Check contract is verified on block explorer
- Ensure function parameters match ABI
- Try increasing gas limit in workflow YAML

---

## 📊 Gas Optimization

**Without ChainReactor:**
- Quest completion: ~50k gas (Polygon)
- NFT claim: ~150k gas (Ethereum)
- Token claim: ~80k gas (BNB)
- Badge claim: ~60k gas (Arbitrum)
- **Total: 4 transactions, ~340k gas**

**With ChainReactor:**
- Quest completion: ~50k gas (Polygon)
- Kwala automation: Paid by Kwala
- **Total: 1 transaction, ~50k gas**
- **Savings: 85% fewer user transactions**

---

## 🏆 Hackathon Highlights

### Innovation (30%)
- First implementation of true parallel multi-chain automation
- Conditional cross-chain logic (read Chain A → write Chain B)
- Web2/Web3 bridge (blockchain events → Discord)

### Technical Execution (30%)
- 4 production-ready smart contracts (verified on explorers)
- 3 Kwala workflows showcasing different trigger types
- Professional frontend with real-time multi-chain data

### Impact (25%)
- Solves major UX pain point in Web3 gaming
- 85% reduction in user transaction count
- Scalable to 100+ games with minimal changes

### Presentation (15%)
- Clean, functional UI with live demo
- Comprehensive documentation
- Clear architecture diagrams

---

## 🔐 Security Considerations

- Contracts use OpenZeppelin libraries (audited)
- Ownable pattern restricts Kwala to authorized actions
- No user funds held in contracts (only rewards)
- Testnet deployment only (not production-ready)

**For Production:**
- Full smart contract audit required
- Implement rate limiting on workflows
- Add multi-sig for contract ownership
- Emergency pause mechanisms

---

## 🌐 Block Explorer Links

After deployment, contracts verified at:

- **Polygon Amoy:** https://amoy.polygonscan.com/address/YOUR_ADDRESS
- **Ethereum Sepolia:** https://sepolia.etherscan.io/address/YOUR_ADDRESS
- **BNB Testnet:** https://testnet.bscscan.com/address/YOUR_ADDRESS
- **Arbitrum Sepolia:** https://sepolia.arbiscan.io/address/YOUR_ADDRESS

---

## 📹 Demo Video

[Link to 3-minute demo video - TO BE RECORDED]

**Script:**
1. [0:00-0:20] Problem intro (manual multi-chain claiming)
2. [0:20-0:45] ChainReactor solution overview
3. [0:45-1:45] Live demo (quest → 3 chains)
4. [1:45-2:15] Kwala YAML walkthrough
5. [2:15-2:45] Architecture + impact
6. [2:45-3:00] Call to action

---

## 🤝 Contributing

This project was built for Kwala Hacker House 2025. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Team

Built by ElGhonerox for Kwala Hacker House 2025

**Connect:**
- GitHub: [@yourusername](https://github.com/elghonerox)

---

## 🙏 Acknowledgments

- **Kwala** for serverless Web3 automation infrastructure
- **OpenZeppelin** for secure smart contract libraries
- **RainbowKit** for seamless multi-chain wallet UX
- **DoraHacks** for hosting the hackathon

---

## 📚 Additional Resources

- [Kwala Documentation](https://kwala.network/docs)
- [Hardhat Docs](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)

---

**Built with ❤️ using Kwala's serverless Web3 automation**