'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { contracts, chainExplorers } from '@/lib/contracts';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Coins, Award, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';

export default function Home() {
  const { address, chain } = useAccount();
  const [selectedQuest, setSelectedQuest] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Read quest data
  const { data: quest1 } = useReadContract({
    ...contracts.polygonAmoy.questContract,
    functionName: 'quests',
    args: [1n],
    chainId: 80002,
  });

  const { data: questCount } = useReadContract({
    ...contracts.polygonAmoy.questContract,
    functionName: 'getPlayerQuestCount',
    args: address ? [address] : undefined,
    chainId: 80002,
  });

  const { data: nftBalance } = useReadContract({
    ...contracts.sepolia.achievementNFT,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: 11155111,
  });

  const { data: tokenBalance } = useReadContract({
    ...contracts.bscTestnet.rewardToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: 97,
  });

  const { data: badges } = useReadContract({
    ...contracts.arbitrumSepolia.badgeTracker,
    functionName: 'getPlayerBadges',
    args: address ? [address] : undefined,
    chainId: 421614,
  });

  // Write contract
  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleCompleteQuest = async (questId: number) => {
    if (chain?.id !== 80002) {
      alert('Please switch to Polygon Amoy network');
      return;
    }

    setSelectedQuest(questId);
    writeContract({
      ...contracts.polygonAmoy.questContract,
      functionName: 'completeQuest',
      args: [BigInt(questId)],
    });
  };

  if (isSuccess && !showSuccess) {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">ChainReactor</h1>
          </div>
          <ConnectButton />
        </div>
      </nav>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Multi-chain rewards triggered! Check your wallet.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {!address ? (
          <div className="text-center py-20">
            <Zap className="w-20 h-20 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Multi-Chain Quest Automation
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              Complete quests. Earn rewards across 4 chains. Powered by Kwala.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Stats Dashboard */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">Quests Completed</span>
                    <span className="text-2xl font-bold text-white">{questCount?.toString() || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">NFTs Earned</span>
                    <span className="text-2xl font-bold text-white">{nftBalance?.toString() || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">CRRT Tokens</span>
                    <span className="text-2xl font-bold text-white">
                      {tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(0) : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">Total Badges</span>
                    <span className="text-2xl font-bold text-white">{badges?.[0]?.toString() || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Chain Status */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-4">Chain Status</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Polygon Amoy', icon: '🟣', status: 'Active' },
                    { name: 'Ethereum Sepolia', icon: '🔷', status: 'Listening' },
                    { name: 'BNB Testnet', icon: '🟡', status: 'Listening' },
                    { name: 'Arbitrum Sepolia', icon: '🔵', status: 'Listening' },
                  ].map((chain) => (
                    <div key={chain.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{chain.icon}</span>
                        <span className="text-sm text-purple-300">{chain.name}</span>
                      </div>
                      <span className="text-xs text-green-400">{chain.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quest Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Available Quests</h2>
                <p className="text-purple-300">
                  Complete a quest → Trigger rewards on 3 chains simultaneously
                </p>
              </div>

              {/* Quest Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {quest1?.[0] || 'Collect 5 Items'}
                    </h3>
                    <p className="text-purple-300">Complete basic collection challenge</p>
                  </div>
                  <div className="bg-purple-500/20 px-4 py-2 rounded-lg">
                    <span className="text-purple-300 text-sm">Quest #1</span>
                  </div>
                </div>

                {/* Rewards Preview */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xs text-purple-300 mb-1">Ethereum</div>
                    <div className="text-sm font-semibold text-white">Achievement NFT</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Coins className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-xs text-purple-300 mb-1">BNB Chain</div>
                    <div className="text-sm font-semibold text-white">10 CRRT Tokens</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Award className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-xs text-purple-300 mb-1">Arbitrum</div>
                    <div className="text-sm font-semibold text-white">+1 Badge</div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleCompleteQuest(1)}
                  disabled={isPending || isConfirming || chain?.id !== 80002}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isPending ? 'Confirming...' : 'Processing...'}
                    </>
                  ) : chain?.id !== 80002 ? (
                    'Switch to Polygon Amoy'
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Complete Quest & Trigger Rewards
                    </>
                  )}
                </button>

                {hash && (
                  <div className="mt-4 text-center">
                    
                      href={`${chainExplorers[80002]}/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center justify-center gap-1"
                    >
                      View transaction <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </motion.div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Powered by Kwala Automation</h4>
                    <p className="text-sm text-blue-300">
                      When you complete a quest, Kwala's serverless workflows automatically trigger
                      NFT minting on Ethereum, token distribution on BNB, and badge updates on Arbitrum
                      — all in parallel, no manual claiming needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-purple-300">
          <p>Built for Kwala Hacker House 2025 • Multi-Chain Automation Demo</p>
        </div>
      </footer>
    </div>
  );
}