'use client';

import { TrophyIcon, ChartBarIcon, StarIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useFanPassport } from '@/hooks/useFanPassport';
import axios from 'axios';

interface Prediction {
  id: string;
  matchId: string;
  predictedWinner: string;
  createdAt: string;
  isCorrect: boolean | null;
}

export default function PredictionsPage() {
  const { user, passport } = useFanPassport();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPredictions() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`/api/predictions?userId=${user.id}`);
        setPredictions(response.data.predictions);
      } catch (error) {
        console.error('Failed to load predictions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPredictions();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-5xl">
        <TrophyIcon className="w-16 h-16 mx-auto text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">Your Predictions</h1>
        <p className="text-zinc-400 max-w-lg mx-auto text-lg">
          Please connect your wallet to view your prediction history and track your fan identity stats.
        </p>
      </div>
    );
  }

  const correctPredictions = predictions.filter(p => p.isCorrect === true).length;
  const totalFinished = predictions.filter(p => p.isCorrect !== null).length;
  const winRate = totalFinished > 0 ? Math.round((correctPredictions / totalFinished) * 100) : 0;

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-5xl font-inter">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Predictions</h1>
        <p className="text-zinc-400 text-lg">Track your accuracy and earn XP for correct match predictions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stats Cards */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group cursor-default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">Total Predictions</h3>
            <ChartBarIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
          </div>
          <p className="text-4xl font-bold text-white">{predictions.length}</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group cursor-default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">Win Rate</h3>
            <TrophyIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
          </div>
          <p className="text-4xl font-bold text-white">{winRate}%</p>
          <p className="text-sm text-zinc-500 mt-1">{correctPredictions} correct out of {totalFinished}</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 group cursor-default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">XP Earned</h3>
            <StarIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
          </div>
          <p className="text-4xl font-bold text-white">{passport?.xp || 0}</p>
          <p className="text-sm text-zinc-500 mt-1">Level {passport?.level || 1}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">History</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-10 bg-zinc-900/50 rounded-3xl border border-white/5">
            <p className="text-zinc-500">You haven't made any predictions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:border-white/20 transition-colors">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                    prediction.isCorrect === true ? 'bg-green-500/20 text-green-500' :
                    prediction.isCorrect === false ? 'bg-red-500/20 text-red-500' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {prediction.isCorrect === true ? '+' : prediction.isCorrect === false ? '-' : '?'}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      Predicted: {prediction.predictedWinner}
                    </h4>
                    <p className="text-zinc-400 text-sm">
                      Match ID: {prediction.matchId} • {new Date(prediction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    prediction.isCorrect === true ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    prediction.isCorrect === false ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    'bg-zinc-800 text-zinc-400 border border-white/5'
                  }`}>
                    {prediction.isCorrect === true ? 'Won +50 XP' : prediction.isCorrect === false ? 'Lost' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
