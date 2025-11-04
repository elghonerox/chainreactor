# ChainReactor Deployment Guide

Complete step-by-step deployment instructions for Kwala Hacker House submission.

---

## ⏱️ Estimated Time: 3-4 Hours

**Breakdown:**
- Prerequisites & Setup: 30 minutes
- Contract Deployment: 60 minutes
- Kwala Configuration: 45 minutes
- Frontend Deployment: 30 minutes
- Testing & Video: 60 minutes

---

## 📋 Prerequisites Checklist

### Required Accounts

- [ ] GitHub account (for code hosting)
- [ ] MetaMask wallet with testnet funds on 4 chains
- [ ] Kwala account (register at kwala.network)
- [ ] WalletConnect Cloud project (cloud.walletconnect.com)
- [ ] Vercel account (for frontend hosting)
- [ ] Discord webhook (optional, for notifications)

### Required Tools
```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Install Git
git --version
```

---

## STEP 1: Initial Setup (30 minutes)

### 1.1 Clone and Install Dependencies
```bash
# Clone repository
git clone https://github.com/yourusername/chainreactor.git
cd chainreactor

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 1.2 Get Testnet Funds

Visit these faucets and get tokens for your wallet:

**Polygon Amoy (need ~0.5 MATIC):**
```
https://faucet.polygon.technology/
```

**Ethereum Sepolia (need ~0.1 ETH):**
```
https://sepoliafaucet.com/
https://www.alchemy.com/faucets/ethereum-sepolia
```

**BNB Testnet (need ~0.5 BNB):**
```
https://testnet.bnbchain.org/faucet-smart
```

**Arbitrum Sepolia (need ~0.05 ETH):**
```
https://faucet.quicknode.com/arbitrum/sepolia
```

**⚠️ TIP:** Get funds 24 hours before deployment. Faucets have rate limits.

### 1.3 Get API Keys

**Block Explorer API Keys (for contract verification):**

1. **PolygonScan:** https://polygonscan.com/apis
2. **Etherscan:** https://etherscan.io/apis
3. **BscScan:** https://bscscan.com/apis
4. **Arbiscan:** https://arbiscan.io/apis

**WalletConnect Project ID:**
1. Go to https://cloud.walletconnect.com
2. Create new project
3. Copy Project ID

### 1.4 Configure Environment Variables
```bash
# Root directory
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=your_metamask_private_key_without_0x

# API Keys
POLYGONSCAN_API_KEY=your_polygonscan_key
ETHERSCAN_API_KEY=your_etherscan_key
BSCSCAN_API_KEY=your_bscscan_key
ARBISCAN_API_KEY=your_arbiscan_key

# Leave these empty for now (fill after deployment)
POLYGON_QUEST_CONTRACT=
ETHEREUM_ACHIEVEMENT_NFT=
BNB_REWARD_TOKEN=
ARBITRUM_BADGE_TRACKER=
```

**⚠️ SECURITY:** Never commit `.env` to Git! It's in `.gitignore`.

---

## STEP 2: Deploy Smart Contracts (60 minutes)

### 2.1 Compile Contracts
```bash
npm run compile
```

Expected output:
```
Compiled 15 Solidity files successfully
```

### 2.2 Deploy to Polygon Amoy
```bash
npm run deploy:polygon
```

**Expected output:**
```
Deploying QuestContract to Polygon Amoy...
QuestContract deployed to: 0xABCD1234...
Waiting for block confirmations...
Verifying contract on PolygonScan...
Contract verified successfully

=== DEPLOYMENT COMPLETE ===
Save this address to your .env file:
POLYGON_QUEST_CONTRACT=0xABCD1234...
```

**✅ Action:** Copy address to `.env` file

**⚠️ If verification fails:**
```bash
# Manual verification
npx hardhat verify --network polygonAmoy 0xYOUR_CONTRACT_ADDRESS
```

### 2.3 Deploy to Ethereum Sepolia
```bash
npm run deploy:ethereum
```

Save `ETHEREUM_ACHIEVEMENT_NFT` address to `.env`

### 2.4 Deploy to BNB Testnet
```bash
npm run deploy:bnb
```

Save `BNB_REWARD_TOKEN` address to `.env`

### 2.5 Deploy to Arbitrum Sepolia
```bash
npm run deploy:arbitrum
```

Save `ARBITRUM_BADGE_TRACKER` address to `.env`

### 2.6 Verify All Contracts Deployed

Check your `.env` file should now have:
```env
POLYGON_QUEST_CONTRACT=0x...
ETHEREUM_ACHIEVEMENT_NFT=0x...
BNB_REWARD_TOKEN=0x...
ARBITRUM_BADGE_TRACKER=0x...
```

**✅ Verify on Block Explorers:**
- Polygon: https://amoy.polygonscan.com/address/YOUR_ADDRESS
- Ethereum: https://sepolia.etherscan.io/address/YOUR_ADDRESS
- BNB: https://testnet.bscscan.com/address/YOUR_ADDRESS
- Arbitrum: https://sepolia.arbiscan.io/address/YOUR_ADDRESS

---

## STEP 3: Configure Kwala Workflows (45 minutes)

### 3.1 Register Kwala Account

1. Go to https://kwala.network
2. Create account / Sign in
3. Create new workspace: "ChainReactor"

### 3.2 Get Kwala Wallet Address

1. In Kwala dashboard, find "Workflow Wallet" section
2. Copy the wallet address
3. **CRITICAL:** Send testnet funds to this address on ALL 4 chains
```bash
# Send from your MetaMask to Kwala wallet:
# - Polygon Amoy: 0.2 MATIC
# - Ethereum Sepolia: 0.05 ETH
# - BNB Testnet: 0.2 BNB
# - Arbitrum Sepolia: 0.02 ETH
```

### 3.3 Transfer Contract Ownership to Kwala

Create `scripts/transfer-ownership.js`:
```javascript
const hre = require("hardhat");

async function main() {
  const KWALA_WALLET = "0xYOUR_KWALA_WALLET_ADDRESS";

  // Replace with your contract addresses
  const contracts = {
    quest: "0xYOUR_POLYGON_CONTRACT",
    nft: "0xYOUR_ETHEREUM_CONTRACT",
    token: "0xYOUR_BNB_CONTRACT",
    badge: "0xYOUR_ARBITRUM_CONTRACT",
  };

  console.log("Transferring ownership to Kwala wallet:", KWALA_WALLET);

  // Transfer each contract
  const Quest = await hre.ethers.getContractAt("QuestContract", contracts.quest);
  await Quest.transferOwnership(KWALA_WALLET);
  console.log("✅ QuestContract ownership transferred");

  // Repeat for other contracts...
}

main().catch(console.error);
```

Run for each network:
```bash
npx hardhat run scripts/transfer-ownership.js --network polygonAmoy
npx hardhat run scripts/transfer-ownership.js --network sepolia
npx hardhat run scripts/transfer-ownership.js --network bnbTestnet
npx hardhat run scripts/transfer-ownership.js --network arbitrumSepolia
```

### 3.4 Update Workflow YAML Files

Edit `workflows/parallel-multi-chain-rewards.yaml`:

Replace ALL placeholder addresses:
```yaml
trigger:
  contract: "0xYOUR_POLYGON_QUEST_CONTRACT"  # Replace this

actions:
  - name: mint_achievement_nft
    contract: "0xYOUR_ETHEREUM_NFT_CONTRACT"  # Replace this

  - name: transfer_reward_tokens
    contract: "0xYOUR_BNB_TOKEN_CONTRACT"  # Replace this

  - name: update_player_badge
    contract: "0xYOUR_ARBITRUM_BADGE_CONTRACT"  # Replace this
```

Repeat for other 2 YAML files.

### 3.5 Deploy Workflows to Kwala

**Option A: Via Dashboard (Recommended)**
1. Go to Kwala dashboard → "Workflows"
2. Click "Create New Workflow"
3. Copy/paste YAML content
4. Save and activate

**Option B: Via CLI (if available)**
```bash
kwala deploy workflows/parallel-multi-chain-rewards.yaml
kwala deploy workflows/achievement-milestone-checker.yaml
kwala deploy workflows/discord-notifications.yaml
```

### 3.6 Test Workflow Execution

1. In Kwala dashboard, go to "Workflows" → "parallel-multi-chain-rewards"
2. Click "Test Trigger"
3. Enter test parameters:
```json
   {
     "player": "0xYOUR_WALLET_ADDRESS",
     "questId": 1
   }
```
4. Click "Execute"
5. **Expected:** See 3 transactions on 3 different chains
6. Verify on block explorers

---

## STEP 4: Deploy Frontend (30 minutes)

### 4.1 Configure Frontend Environment
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

NEXT_PUBLIC_POLYGON_QUEST_CONTRACT=0xYOUR_POLYGON_CONTRACT
NEXT_PUBLIC_ETHEREUM_ACHIEVEMENT_NFT=0xYOUR_ETHEREUM_CONTRACT
NEXT_PUBLIC_BNB_REWARD_TOKEN=0xYOUR_BNB_CONTRACT
NEXT_PUBLIC_ARBITRUM_BADGE_TRACKER=0xYOUR_ARBITRUM_CONTRACT
```

### 4.2 Test Locally
```bash
npm run dev
```

Open http://localhost:3000

**Test checklist:**
- [ ] Wallet connects successfully
- [ ] Can switch between 4 chains
- [ ] Quest data loads from Polygon
- [ ] Stats display correctly
- [ ] Complete quest button works

### 4.3 Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow prompts:
- Project name: `chainreactor`
- Framework: `Next.js`
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `.next`

**Set environment variables in Vercel:**
1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### 4.4 Test Production Deployment

1. Visit your Vercel URL
2. Complete full user flow:
   - Connect wallet
   - Complete quest
   - Verify rewards on 3 chains

---

## STEP 5: Final Testing & Video (60 minutes)

### 5.1 End-to-End Test

**Test Scenario 1: First Quest Completion**
1. Connect fresh wallet (no prior quests)
2. Complete Quest #1 on Polygon
3. Wait 30 seconds
4. Check Ethereum: Should have 1 Achievement NFT
5. Check BNB: Should have 10 CRRT tokens
6. Check Arbitrum: Should have 1 badge

**Test Scenario 2: Milestone Achievement**
1. Complete 2 more quests (total = 3)
2. Wait for cron job (or trigger manually in Kwala)
3. Check Ethereum: Should have Bronze Tier NFT

### 5.2 Record Demo Video

**Equipment:**
- Screen recording software (OBS, Loom, or QuickTime)
- Good microphone
- Quiet environment

**Script (3 minutes 30 seconds):**
```
[0:00-0:20] HOOK
"Web3 gaming has a UX problem. Complete a quest on one chain,
then manually claim rewards on three other chains.
Four transactions. Four gas fees. Ten minutes of frustration."

[Show manual claiming process, express frustration]

[0:20-0:45] SOLUTION INTRO
"ChainReactor solves this with Kwala-powered automation.
One quest completion triggers rewards across multiple chains—
simultaneously. No bridges. No manual claiming."

[Show ChainReactor logo, architecture diagram]

[0:45-1:45] LIVE DEMO (THE MONEY SHOT)
"Watch this. I complete Quest #1 on Polygon..."
[Click button, show transaction]

"The moment it confirms, Kwala's workflow triggers..."
[Show Kwala dashboard with workflow executing]

"Three chains execute in parallel:"
[Split screen showing 3 block explorers updating]

"Ethereum: Achievement NFT minted"
[Show NFT in wallet]

"BNB Chain: 10 reward tokens transferred"
[Show token balance]

"Arbitrum: Player badge updated"
[Show badge count]

"All automatic. Zero manual claiming."

[1:45-2:15] YAML WALKTHROUGH
"Here's the magic—this YAML workflow orchestrates everything:"
[Show YAML file with key sections highlighted]

"One trigger: QuestCompleted event on Polygon"
"Three parallel actions across three chains"
"Kwala handles gas, timing, and execution"

[2:15-2:45] IMPACT & ARCHITECTURE
"This isn't just for one game. The same pattern scales:
- 100 quests
- 10 chains
- Unlimited players

85% reduction in user transactions.
Built on four production-ready smart contracts,
three Kwala workflows, and a clean React frontend."

[Show architecture diagram, GitHub repo]

[2:45-3:00] CALL TO ACTION
"ChainReactor proves serverless automation is the future
of Web3 UX. Check out the full code on GitHub,
and see how Kwala makes multi-chain coordination effortless."

[Show GitHub link, team info]
```

### 5.3 Record Backup Footage

In case live demo fails during judging:
- Record successful quest completion
- Record Kwala dashboard showing workflow execution
- Record all 3 block explorers confirming transactions
- Record wallet showing all rewards received

### 5.4 Edit Video

**Required elements:**
- Clear audio (no background noise)
- 1080p resolution minimum
- Captions/subtitles for key points
- Background music (low volume, royalty-free)
- Smooth transitions
- Code snippets readable
- Block explorer transactions visible

**Tools:**
- **Free:** DaVinci Resolve, iMovie
- **Paid:** Adobe Premiere, Final Cut Pro

---

## STEP 6: Submission (30 minutes)

### 6.1 Prepare GitHub Repository

**Required files:**
- [x] All smart contracts
- [x] All Kwala YAML workflows
- [x] Complete frontend code
- [x] Deployment scripts
- [x] README.md with setup instructions
- [x] .env.example (no secrets!)
- [x] LICENSE file (MIT recommended)

**Organize repo:**
```bash
# Create clean commit history
git add .
git commit -m "feat: Complete ChainReactor multi-chain automation"
git push origin main
```

**Add these GitHub sections:**
1. Repository description: "Multi-chain quest automation powered by Kwala"
2. Topics: `web3`, `blockchain`, `kwala`, `automation`, `multi-chain`
3. README badges (optional but professional)

### 6.2 Create Submission on DoraHacks

1. Go to https://dorahacks.io/hackathon/buildwithkwala
2. Click "Submit Project"
3. Fill out form:

**Project Name:** ChainReactor

**Tagline:** Multi-chain quest automation powered by Kwala

**Description:**