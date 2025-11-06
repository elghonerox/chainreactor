'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { contracts, chainExplorers } from '@/lib/contracts';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Coins, Award, ExternalLink, CheckCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    if (isSuccess && !showSuccess) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [isSuccess, showSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <nav className="relative border-b border-purple-500/20 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ChainReactor
                </h1>
                <p className="text-xs text-purple-300">Multi-Chain Automation</p>
              </div>
            </motion.div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400/50">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-bold">Quest Completed! 🎉</p>
                <p className="text-sm text-green-100">Multi-chain rewards triggered</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!address ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block mb-8"
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-3xl shadow-2xl">
                <Zap className="w-24 h-24 text-white" />
              </div>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Multi-Chain Quest
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Automation
              </span>
            </h2>
            
            <p className="text-xl text-purple-200 mb-4 max-w-2xl mx-auto">
              Complete quests. Earn rewards across <span className="font-bold text-purple-300">4 chains</span>.
            </p>
            <p className="text-lg text-purple-300/80 mb-12 max-w-xl mx-auto">
              Powered by Kwala serverless workflows
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ConnectButton />
            </motion.div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
              {[
                { icon: Sparkles, title: "One Click", desc: "Complete quest once" },
                { icon: Zap, title: "Auto Trigger", desc: "Kwala handles the rest" },
                { icon: Trophy, title: "Multi-Chain", desc: "Rewards on 4 chains" }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                >
                  <feature.icon className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                  <p className="text-purple-300 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Stats Dashboard - Centered */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Quests", value: questCount?.toString() || '0', icon: Sparkles, color: "from-purple-500 to-pink-500" },
                  { label: "NFTs", value: nftBalance?.toString() || '0', icon: Trophy, color: "from-yellow-500 to-orange-500" },
                  { label: "Tokens", value: tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(0) : '0', icon: Coins, color: "from-green-500 to-emerald-500" },
                  { label: "Badges", value: badges?.[0]?.toString() || '0', icon: Award, color: "from-blue-500 to-cyan-500" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                  >
                    <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-purple-300 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quest Card - Centered & Larger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-white mb-3">Available Quest</h2>
                <p className="text-purple-300">
                  Complete once → Trigger rewards on 3 chains simultaneously
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-purple-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden"
              >
                {/* Animated glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-pulse-slow" />
                
                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="inline-block bg-purple-500/20 px-4 py-1 rounded-full mb-3">
                        <span className="text-purple-300 text-sm font-semibold">Quest #1</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {quest1?.[0] || 'Collect 5 Items'}
                      </h3>
                      <p className="text-purple-300">Complete basic collection challenge</p>
                    </div>
                  </div>

                  {/* Rewards Preview - Better Layout */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: Trophy, chain: "Ethereum", reward: "Achievement NFT", color: "from-blue-500 to-purple-500" },
                      { icon: Coins, chain: "BNB Chain", reward: "10 CRRT Tokens", color: "from-yellow-500 to-green-500" },
                      { icon: Award, chain: "Arbitrum", reward: "+1 Badge", color: "from-cyan-500 to-blue-500" },
                    ].map((reward, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center"
                      >
                        <div className={`bg-gradient-to-br ${reward.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                          <reward.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-xs text-purple-300 mb-1">{reward.chain}</p>
                        <p className="text-sm font-semibold text-white">{reward.reward}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Button - Centered & Larger */}
                  <motion.button
                    onClick={() => handleCompleteQuest(1)}
                    disabled={isPending || isConfirming || chain?.id !== 80002}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold py-5 px-8 rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/50 flex items-center justify-center gap-3 text-lg"
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        {isPending ? 'Confirming Transaction...' : 'Processing Rewards...'}
                      </>
                    ) : chain?.id !== 80002 ? (
                      <>
                        Switch to Polygon Amoy
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        Complete Quest & Trigger Rewards
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  {hash && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-center"
                    >
                      
                        href={`${chainExplorers[80002]}/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                      >
                        View transaction on PolygonScan
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Info Box - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-xl h-fit">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">Powered by Kwala Automation</h4>
                    <p className="text-blue-200 leading-relaxed">
                      When you complete a quest, Kwala's serverless workflows automatically trigger
                      NFT minting on Ethereum, token distribution on BNB, and badge updates on Arbitrum
                      — all in parallel, no manual claiming needed.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chain Status - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Chain Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Polygon', icon: '🟣', status: 'Active' },
                    { name: 'Ethereum', icon: '🔷', status: 'Listening' },
                    { name: 'BNB', icon: '🟡', status: 'Listening' },
                    { name: 'Arbitrum', icon: '🔵', status: 'Listening' },
                  ].map((chain, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="text-center"
                    >
                      <div className="text-3xl mb-2">{chain.icon}</div>
                      <p className="text-white text-sm font-medium">{chain.name}</p>
                      <p className="text-green-400 text-xs mt-1">● {chain.status}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-purple-500/20 mt-20 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-purple-300">
            Built for <span className="font-semibold text-purple-400">Kwala Hacker House 2025</span> • Multi-Chain Automation Demo
          </p>
          <p className="text-purple-400/60 text-sm mt-2">
            Deployed on Polygon Amoy • Powered by Kwala Workflows
          </p>
        </div>
      </footer>
    </div>
  );
}
