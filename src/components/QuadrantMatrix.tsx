import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  User, 
  Cpu, 
  Send, 
  PlusCircle, 
  RefreshCw 
} from 'lucide-react';
import { TaskClassification } from '../types';

interface QuadrantMatrixProps {
  onSelectWorkflow: (tab: 'news' | 'zapier') => void;
  onOpenClassifier: () => void;
  customClassifiedTasks: TaskClassification[];
}

export const QuadrantMatrix: React.FC<QuadrantMatrixProps> = ({
  onSelectWorkflow,
  onOpenClassifier,
  customClassifiedTasks,
}) => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(1);

  // Baseline standard tasks pre-mapped to illustrate the framework
  const baselineTasks: Array<{
    id: string;
    name: string;
    quadrant: 1 | 2 | 3 | 4;
    description: string;
    isPrimaryFocus?: boolean;
    tags: string[];
  }> = [
    {
      id: 'task-sg-news',
      name: 'News summarization in simple terms of key topics and impact',
      quadrant: 1,
      isPrimaryFocus: true,
      description: 'Human editor steers editorial criteria, verifies truth, and authorizes distribution to stakeholders via Zapier; AI extracts key topics, distills complex articles, and synthesizes business implications.',
      tags: ['Singapore Business', 'Briefing', 'Human Oversight', 'Gemini Inside'],
    },
    {
      id: 'task-sec-filing',
      name: 'Regulatory compliance review & audit sign-off',
      quadrant: 1,
      description: 'Auditor leads legally binding sign-off; AI systematically cross-checks footnotes and financial statements against statutory rules.',
      tags: ['Compliance', 'Auditing'],
    },
    {
      id: 'task-creative-campaign',
      name: 'Creative marketing campaign concepts & video storyboards',
      quadrant: 2,
      description: 'AI agents generate dozens of creative variants, synthetic customer angles, and copy; human creative director judges and selects winning themes.',
      tags: ['Creativity', 'AI Exploration'],
    },
    {
      id: 'task-ocr-invoice',
      name: 'Standard invoice data extraction & format normalization',
      quadrant: 3,
      description: 'Fully automated extraction of dates, totals, and line items with high confidence threshold; runs unattended.',
      tags: ['Data Processing', 'Automation'],
    },
    {
      id: 'task-merger-negotiation',
      name: 'M&A strategic advisory & client negotiation planning',
      quadrant: 4,
      description: 'A person decides with AI alongside. Senior partner plans strategy while AI drafts valuation scenarios and counter-arguments.',
      tags: ['Strategy', 'Co-Pilot'],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Framework Header Slide Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 relative overflow-hidden">
        {/* Slide badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-200 animate-pulse"></span>
              <span>PROF. ROH'S ANIMATED ILLUSTRATION</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Step 5 of 6 &bull; Framework Architecture</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenClassifier}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Classify Any Task with Gemini</span>
            </button>
          </div>
        </div>

        {/* Slide Main Question */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          when people and ai share a task, who should lead?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
          Team, two questions place any task on this map:{' '}
          <strong className="text-slate-800 underline decoration-indigo-300">Does it have a right answer?</strong>{' '}
          and{' '}
          <strong className="text-slate-800 underline decoration-sky-300">
            Is it work that people and AI must do together, or work that either of them can do alone?
          </strong>
        </p>

        {/* Active Highlight Banner for Singapore News Task */}
        <div className="mt-5 p-3.5 bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 rounded-xl border border-indigo-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs">
              Q1
            </span>
            <div>
              <p className="text-xs font-semibold text-indigo-950">
                Current Task Focus: <span className="font-bold underline">News summarization in simple terms of key topics and impact</span>
              </p>
              <p className="text-[12px] text-slate-600">
                Categorized into <strong className="text-indigo-900">Quadrant 1</strong>: Work that people & AI must do together &bull; Work with a right answer (<span className="italic font-medium text-purple-900">A person leads, AI inside</span>).
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectWorkflow('news')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <span>Launch News Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="bg-slate-50/70 p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-inner">
        {/* Matrix Header Row (Columns: Answer Dimension) */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-12 md:col-span-3 hidden md:block">
            {/* Corner label */}
            <div className="h-full flex items-center justify-end pr-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Task Collaboration</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4.5 bg-slate-800 text-white rounded-xl py-2.5 px-4 text-center font-bold text-xs sm:text-sm tracking-wide shadow-sm flex items-center justify-center space-x-2">
            <span>Work with a right answer</span>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">
              Fact / Verifiable
            </span>
          </div>
          <div className="col-span-12 md:col-span-4.5 bg-slate-800 text-white rounded-xl py-2.5 px-4 text-center font-bold text-xs sm:text-sm tracking-wide shadow-sm flex items-center justify-center space-x-2">
            <span>Work with no single right answer</span>
            <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">
              Subjective / Generative
            </span>
          </div>
        </div>

        {/* Row 1: People & AI must do together */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {/* Row Header 1 */}
          <div className="col-span-12 md:col-span-3 bg-slate-200/80 rounded-xl p-4 flex flex-col justify-center text-center md:text-right border border-slate-300/60">
            <span className="font-bold text-slate-800 text-xs sm:text-sm">
              Work that people and AI must do together
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Shared agency & reciprocal feedback
            </span>
          </div>

          {/* QUADRANT 1 (Top-Left) */}
          <div 
            onClick={() => setSelectedQuadrant(1)}
            className={`col-span-12 md:col-span-4.5 rounded-2xl p-6 transition-all cursor-pointer relative border-2 ${
              selectedQuadrant === 1
                ? 'bg-purple-50/50 border-purple-600 shadow-md ring-4 ring-purple-100'
                : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-sm'
            }`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-purple-100 text-purple-900 border border-purple-200">
                Quadrant 1 &bull; Top-Left
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Our Target Quadrant</span>
              </span>
            </div>

            {/* Concentric Ovals Graphic: Person Leads (Purple outer), AI inside (Cyan inner) */}
            <div className="my-4 py-4 flex items-center justify-center">
              <div className="w-full max-w-[280px] h-32 rounded-[60px] border-3 border-purple-600 bg-purple-50/80 flex flex-col items-center justify-center relative shadow-xs">
                <span className="text-xs font-bold text-purple-900 mb-1 tracking-tight">
                  A person leads
                </span>
                
                {/* Inner cyan oval */}
                <div className="w-36 h-16 rounded-[40px] border-2 border-teal-500 bg-teal-50 flex items-center justify-center shadow-xs">
                  <span className="text-xs font-bold text-teal-800">
                    AI inside
                  </span>
                </div>
              </div>
            </div>

            {/* Core Rationale */}
            <div className="space-y-2 mt-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Leadership Archetype: <span className="text-purple-700 font-bold">A person leads, AI inside</span>
              </p>
              <p className="text-slate-600 leading-relaxed">
                The human defines objectives, sets criteria, validates accuracy, and sends final briefings. AI powers the heavy synthesis, rapid topic clustering, and data extraction inside.
              </p>
            </div>

            {/* Task Tag in this Quadrant */}
            <div className="mt-4 pt-3 border-t border-purple-100">
              <div className="p-2.5 rounded-xl bg-purple-100/70 border border-purple-200 text-purple-950 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>News Summarization Pipeline</span>
                  </span>
                  <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-medium">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-purple-900/90 leading-tight">
                  Google News RSS &rarr; Gemini simple terms & impact &rarr; Zapier Outbound Email
                </p>
              </div>
            </div>
          </div>

          {/* QUADRANT 2 (Top-Right) */}
          <div 
            onClick={() => setSelectedQuadrant(2)}
            className={`col-span-12 md:col-span-4.5 rounded-2xl p-6 transition-all cursor-pointer relative border-2 ${
              selectedQuadrant === 2
                ? 'bg-teal-50/50 border-teal-600 shadow-md ring-4 ring-teal-100'
                : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-sm'
            }`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-teal-100 text-teal-900 border border-teal-200">
                Quadrant 2 &bull; Top-Right
              </span>
              <span className="text-[11px] text-slate-500">Subjective & Shared</span>
            </div>

            {/* Concentric Ovals Graphic: AI agents run the work (Cyan outer), person judges inside (Purple inner) */}
            <div className="my-4 py-4 flex items-center justify-center">
              <div className="w-full max-w-[280px] h-32 rounded-[60px] border-3 border-teal-600 bg-teal-50/80 flex flex-col items-center justify-center relative shadow-xs">
                <span className="text-xs font-bold text-teal-900 mb-1 tracking-tight">
                  AI agents run the work
                </span>
                
                {/* Inner purple oval */}
                <div className="w-40 h-16 rounded-[40px] border-2 border-purple-500 bg-purple-50 flex items-center justify-center shadow-xs">
                  <span className="text-xs font-bold text-purple-800 text-center px-1">
                    a person judges inside
                  </span>
                </div>
              </div>
            </div>

            {/* Core Rationale */}
            <div className="space-y-2 mt-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Leadership Archetype: <span className="text-teal-700 font-bold">AI agents run, person judges</span>
              </p>
              <p className="text-slate-600 leading-relaxed">
                Autonomous agents churn through multi-step exploratory workflows (ideation, drafts, code prototypes), while a human reviewer applies critical judgment, brand nuance, and editorial taste.
              </p>
            </div>

            {/* Example Task */}
            <div className="mt-4 pt-3 border-t border-teal-100">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">Archetypal Tasks:</span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 text-[11px] font-medium mr-1.5 mb-1">
                Multi-concept campaign drafting
              </span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                Synthetic persona interviews
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Either of them can do alone */}
        <div className="grid grid-cols-12 gap-3">
          {/* Row Header 2 */}
          <div className="col-span-12 md:col-span-3 bg-slate-200/80 rounded-xl p-4 flex flex-col justify-center text-center md:text-right border border-slate-300/60">
            <span className="font-bold text-slate-800 text-xs sm:text-sm">
              Work that either of them can do alone
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Independent execution possible
            </span>
          </div>

          {/* QUADRANT 3 (Bottom-Left) */}
          <div 
            onClick={() => setSelectedQuadrant(3)}
            className={`col-span-12 md:col-span-4.5 rounded-2xl p-6 transition-all cursor-pointer relative border-2 ${
              selectedQuadrant === 3
                ? 'bg-sky-50/50 border-sky-600 shadow-md ring-4 ring-sky-100'
                : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-sm'
            }`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-sky-100 text-sky-900 border border-sky-200">
                Quadrant 3 &bull; Bottom-Left
              </span>
              <span className="text-[11px] text-slate-500">Deterministic & Solo</span>
            </div>

            {/* Graphic: Single cyan oval: AI alone */}
            <div className="my-4 py-4 flex items-center justify-center">
              <div className="w-56 h-28 rounded-[55px] border-3 border-teal-600 bg-teal-50 flex items-center justify-center shadow-xs">
                <span className="text-base font-extrabold text-teal-900">
                  AI alone
                </span>
              </div>
            </div>

            {/* Core Rationale */}
            <div className="space-y-2 mt-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Leadership Archetype: <span className="text-teal-700 font-bold">AI alone</span>
              </p>
              <p className="text-slate-600 leading-relaxed">
                Single clear right answer that AI can verify deterministically without human friction. Standard data extraction, schema validation, code linting, and automated reporting.
              </p>
            </div>

            {/* Example Task */}
            <div className="mt-4 pt-3 border-t border-sky-100">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">Archetypal Tasks:</span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-[11px] font-medium mr-1.5 mb-1">
                Receipt / Invoice OCR parsing
              </span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                JSON format schema conversions
              </span>
            </div>
          </div>

          {/* QUADRANT 4 (Bottom-Right) */}
          <div 
            onClick={() => setSelectedQuadrant(4)}
            className={`col-span-12 md:col-span-4.5 rounded-2xl p-6 transition-all cursor-pointer relative border-2 ${
              selectedQuadrant === 4
                ? 'bg-amber-50/50 border-amber-600 shadow-md ring-4 ring-amber-100'
                : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                Quadrant 4 &bull; Bottom-Right
              </span>
              <span className="text-[11px] text-slate-500">Strategic Co-Pilot</span>
            </div>

            {/* Graphic: Overlapping Venn ovals: A person + AI */}
            <div className="my-4 py-4 flex items-center justify-center">
              <div className="relative flex items-center justify-center w-full max-w-[280px] h-28">
                {/* Purple Oval: A person */}
                <div className="w-36 h-24 rounded-[45px] border-2 border-purple-600 bg-purple-100/90 flex items-center justify-center z-10 shadow-sm -mr-8">
                  <span className="text-xs font-bold text-purple-900">
                    A person
                  </span>
                </div>
                {/* Teal Oval: + AI */}
                <div className="w-36 h-24 rounded-[45px] border-2 border-teal-500 bg-teal-100/80 flex items-center justify-center z-20 shadow-sm backdrop-blur-xs">
                  <span className="text-xs font-bold text-teal-900 ml-4">
                    + AI
                  </span>
                </div>
              </div>
            </div>

            {/* Core Rationale (Direct quote from the slide footer) */}
            <div className="space-y-2 mt-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Leadership Archetype: <span className="text-amber-800 font-bold">A person decides with AI alongside</span>
              </p>
              <p className="text-slate-600 leading-relaxed italic bg-amber-50 p-2.5 rounded-lg border border-amber-200/60">
                "5. No single right answer, and either of them can do it alone: a person decides with AI alongside. A consultant advises on a merger; a banker plans a client negotiation with AI drafting options."
              </p>
            </div>

            {/* Example Task */}
            <div className="mt-4 pt-3 border-t border-amber-100">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">Archetypal Tasks:</span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] font-medium mr-1.5 mb-1">
                Executive negotiation strategy
              </span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                M&A scenario planning
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Quadrant Deep Dive Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Quadrant {selectedQuadrant} Analysis
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {selectedQuadrant === 1 && 'Quadrant 1: A Person Leads, AI Inside'}
                {selectedQuadrant === 2 && 'Quadrant 2: AI Agents Run the Work, A Person Judges Inside'}
                {selectedQuadrant === 3 && 'Quadrant 3: AI Alone (Autonomous Processing)'}
                {selectedQuadrant === 4 && 'Quadrant 4: A Person Decides with AI Alongside'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Detailed organizational protocol, accountability lines, and task placement breakdown.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenClassifier}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Test Another Task</span>
            </button>
            {selectedQuadrant === 1 && (
              <button
                onClick={() => onSelectWorkflow('news')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <span>Run Singapore News Briefing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quadrant Specific Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm mb-2">
              <User className="w-4 h-4 text-purple-600" />
              <span>Human Role & Mandate</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedQuadrant === 1 && 'Sets editorial thresholds, specifies Singapore business priorities, conducts spot-checks on facts, verifies political/macro context, and approves external dispatch via Zapier.'}
              {selectedQuadrant === 2 && 'Reviews generated alternatives, injects aesthetic and brand values, eliminates hallucinatory drift, and makes ultimate executive judgment call.'}
              {selectedQuadrant === 3 && 'Designs the schema, monitors error telemetry, handles edge case exceptions, and maintains system boundaries.'}
              {selectedQuadrant === 4 && 'Maintains sovereign decision authority, frames the core dilemma, and drives relationship & negotiation dynamics.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm mb-2">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>AI Role & Execution</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedQuadrant === 1 && 'Ingests dense Google News RSS streams, parses XML, strips noise, distills key topics, categorizes Singapore relevance, and drafts structured impact briefs.'}
              {selectedQuadrant === 2 && 'Deploys autonomous agents to research, synthesize diverse perspectives, generate creative storyboards, and outline scenario matrices.'}
              {selectedQuadrant === 3 && 'Executes fast, deterministic transformations, math proofs, OCR extraction, and schema mappings without human intervention.'}
              {selectedQuadrant === 4 && 'Serves as an on-demand sounding board, counter-arguing assumptions, drafting alternative contract clauses, and stress-testing strategy.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Key Failure Mode & Risk</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedQuadrant === 1 && 'Automation complacency: sending raw AI summaries to clients or executives without human verification of Singapore regulatory nuances or factual accuracy.'}
              {selectedQuadrant === 2 && 'Paralysis by option overload: letting agents generate infinite variants without decisive human curation.'}
              {selectedQuadrant === 3 && 'Silent schema drift or unhandled data edge cases causing silent data corruption.'}
              {selectedQuadrant === 4 && 'Surrendering strategic intuition to algorithmic consensus, losing human competitive edge in negotiations.'}
            </p>
          </div>
        </div>

        {/* Tasks in this Quadrant */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          {(() => {
            const allItems = [
              ...baselineTasks.map(t => ({
                id: t.id,
                name: t.name,
                quadrant: t.quadrant,
                description: t.description,
                isPrimaryFocus: !!t.isPrimaryFocus,
              })),
              ...customClassifiedTasks.map((t, idx) => ({
                id: `custom-${idx}`,
                name: t.taskName,
                quadrant: t.quadrantNumber,
                description: t.whyThisQuadrant,
                isPrimaryFocus: false,
              })),
            ];

            const currentQuadrantItems = allItems.filter(item => item.quadrant === selectedQuadrant);

            return (
              <>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Assigned Tasks in Quadrant {selectedQuadrant} ({currentQuadrantItems.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuadrantItems.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        task.isPrimaryFocus
                          ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-100'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 leading-tight">
                          {task.name}
                        </span>
                        {task.isPrimaryFocus && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-600 text-white shrink-0">
                            Target Task
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2">
                        {task.description}
                      </p>
                      {task.isPrimaryFocus && (
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                            Live Pipeline Ready
                          </span>
                          <button
                            onClick={() => onSelectWorkflow('news')}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Execute</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
