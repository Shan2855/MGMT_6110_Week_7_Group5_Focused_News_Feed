/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { QuadrantMatrix } from './components/QuadrantMatrix';
import { NewsSummarizer } from './components/NewsSummarizer';
import { ZapierDispatcher } from './components/ZapierDispatcher';
import { TaskClassifierModal } from './components/TaskClassifierModal';
import { BriefingResult, TaskClassification } from './types';
import { Layers, ShieldCheck, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'news' | 'zapier'>('matrix');
  const [currentBriefing, setCurrentBriefing] = useState<BriefingResult | null>(null);
  const [isClassifierOpen, setIsClassifierOpen] = useState(false);
  const [customClassifiedTasks, setCustomClassifiedTasks] = useState<TaskClassification[]>([]);

  const handleTaskClassified = (classification: TaskClassification) => {
    setCustomClassifiedTasks((prev) => [classification, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        summarizedCount={currentBriefing?.summaries?.length || 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'matrix' && (
          <QuadrantMatrix
            onSelectWorkflow={(tab) => setActiveTab(tab)}
            onOpenClassifier={() => setIsClassifierOpen(true)}
            customClassifiedTasks={customClassifiedTasks}
          />
        )}

        {activeTab === 'news' && (
          <NewsSummarizer
            onSummarized={(result) => setCurrentBriefing(result)}
            onProceedToZapier={() => setActiveTab('zapier')}
            currentBriefing={currentBriefing}
          />
        )}

        {activeTab === 'zapier' && (
          <ZapierDispatcher
            briefing={currentBriefing}
            onBackToNews={() => setActiveTab('news')}
          />
        )}
      </main>

      {/* Task Classifier Modal */}
      <TaskClassifierModal
        isOpen={isClassifierOpen}
        onClose={() => setIsClassifierOpen(false)}
        onTaskClassified={handleTaskClassified}
      />

      {/* Global Minimal Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">TaskQuadrant</span>
            <span>&bull;</span>
            <span>Prof. Roh Task Segregation Architecture</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-purple-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>Q1: Person Leads, AI Inside</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center space-x-1 text-amber-700 font-medium">
              <Mail className="w-3.5 h-3.5" />
              <span>Zapier Outbound Pipeline</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
