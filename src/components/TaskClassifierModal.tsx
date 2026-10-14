import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Cpu,
  Layers
} from 'lucide-react';
import { TaskClassification } from '../types';

interface TaskClassifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskClassified: (classification: TaskClassification) => void;
}

const PRESET_TASKS = [
  'News summarization in simple terms of key topics and impact',
  'Automated detection of fraudulent credit card transactions',
  'Drafting executive board meeting minutes from raw audio',
  'Advising on cross-border corporate merger deal structure',
  'Designing 20 creative visual concepts for a luxury product launch',
  'Extracting invoice date, tax, and total from PDF receipts'
];

export const TaskClassifierModal: React.FC<TaskClassifierModalProps> = ({
  isOpen,
  onClose,
  onTaskClassified,
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TaskClassification | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClassify = async (taskText = taskInput) => {
    if (!taskText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/classify-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription: taskText.trim() }),
      });

      if (!res.ok) {
        throw new Error('Failed to classify task');
      }

      const data = await res.json();
      if (data.classification) {
        setResult(data.classification);
        onTaskClassified(data.classification);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Classification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Prof. Roh's AI Task Segregation Engine
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates any workflow against the two structural questions to determine who leads.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-5 space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Describe the Task or Workflow
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g., News summarization in simple terms of key topics and impact, or medical prescription triage..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Quick Test Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TASKS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTaskInput(preset);
                    handleClassify(preset);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleClassify(taskInput)}
              disabled={isLoading || !taskInput.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Two Dimensions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Segregate into Quadrant</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {error}
          </div>
        )}

        {/* Classification Result Card */}
        {result && (
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white shadow-xs">
                  Quadrant {result.quadrantNumber}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {result.leadershipArchetype}
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                Segregated Successfully
              </span>
            </div>

            {/* The 2 Core Dimensions Answers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Dimension 1: Right Answer?
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {result.answerDimension}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Dimension 2: Collaboration?
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {result.collaborationDimension}
                </span>
              </div>
            </div>

            {/* Roles breakdown */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/70 text-xs space-y-2">
              <div className="flex items-start space-x-2">
                <User className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-900">Human Role:</strong>{' '}
                  <span className="text-slate-700">{result.humanRole}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Cpu className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-teal-900">AI Role:</strong>{' '}
                  <span className="text-slate-700">{result.aiRole}</span>
                </div>
              </div>
            </div>

            {/* Why This Quadrant */}
            <div className="text-xs text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-800">Reasoning:</strong>{' '}
                {result.whyThisQuadrant}
              </p>
            </div>

            {/* Action footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                View on Matrix
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
