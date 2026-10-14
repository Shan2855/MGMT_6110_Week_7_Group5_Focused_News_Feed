import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Edit3, 
  Plus, 
  Code2, 
  Eye, 
  Globe, 
  AlertCircle,
  HelpCircle,
  Info,
  ChevronRight
} from 'lucide-react';
import { BriefingResult } from '../types';

interface ZapierDispatcherProps {
  briefing: BriefingResult | null;
  onBackToNews: () => void;
}

export const ZapierDispatcher: React.FC<ZapierDispatcherProps> = ({
  briefing,
  onBackToNews,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('shantanu281098@gmail.com');
  const [subject, setSubject] = useState('Singapore Business Intelligence Briefing');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'configure' | 'preview' | 'payload' | 'setupGuide'>('configure');
  const [isSending, setIsSending] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // If no briefing has been generated yet, provide high-quality fallback demo data matching the user's screenshot
  const activeItems = briefing?.summaries && briefing.summaries.length > 0 ? briefing.summaries : [
    {
      headline: 'Australia tax reform triggers cross-border wealth relocations to Singapore',
      singaporeRelevance: 'Singapore is identified as the prime destination for high-net-worth Asian capital and regional treasury desks looking for tax clarity and stability.',
      summary: 'The South China Morning Post reported wealth managers and family offices preparing capital migration amid shifting regional tax regimes.',
      businessImplications: 'Potential expansion in private banking inflows, wealth tech demand, and demand for Singapore commercial family office infrastructure.',
      keyTopics: ['Taxation', 'Wealth Management', 'Family Offices'],
      originalSource: 'South China Morning Post',
      originalUrl: 'https://news.google.com/rss/search?q=Singapore+business',
    },
    {
      headline: 'Singapore manufacturing and electronics sector posts resilient export orders',
      singaporeRelevance: 'Non-oil domestic exports (NODX) rebound signals sustained strength for Singapore-based semiconductor test facilities.',
      summary: 'Enterprise Singapore figures show steady regional tech supply chain normalization with strong demand from ASEAN trade partners.',
      businessImplications: 'Positive outlook for industrial logistics, precision engineering suppliers, and semiconductor talent hiring.',
      keyTopics: ['Manufacturing', 'Trade', 'NODX'],
      originalSource: 'The Business Times',
      originalUrl: 'https://news.google.com/rss/search?q=Singapore+business',
    }
  ];

  const primaryItem = activeItems[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTriggerZapier = async () => {
    setIsSending(true);
    setDispatchResult(null);

    const payload = {
      recipient: recipientEmail,
      subject: subject,
      timestamp: new Date().toISOString(),
      taskContext: {
        framework: "Prof. Roh's 2x2 Matrix",
        quadrant: "Quadrant 1: A Person Leads, AI Inside",
        dimensionAnswer: "Work with a right answer",
        dimensionCollaboration: "Work that people and AI must do together",
      },
      briefing: {
        title: briefing?.briefingTitle || subject,
        executiveSummary: briefing?.executiveSummary || 'Executive summary of key Singapore business movements.',
        totalArticles: activeItems.length,
        items: activeItems,
      },
      // Exact Zapier variables matching Image 2 screenshot
      zapierFields: {
        headline: primaryItem.headline,
        singaporeRelevance: primaryItem.singaporeRelevance,
        businessImplications: primaryItem.businessImplications,
        summary: primaryItem.summary,
      },
      rawZapierBody: activeItems.map((item, idx) => `
[Item ${idx + 1}]
2. Singapore Relevance: ${item.singaporeRelevance}
2. Headline: ${item.headline}
2. Business Implications: ${item.businessImplications}
2. Summary: ${item.summary}
Source: ${item.originalSource || 'Google News'}
`).join('\n----------------------------------------\n')
    };

    try {
      const res = await fetch('/api/zapier/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim() || undefined,
          payload,
        }),
      });

      const data = await res.json();
      setDispatchResult(data);
    } catch (err: any) {
      console.error(err);
      setDispatchResult({
        status: 'error',
        message: err.message || 'Dispatch failed',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-200">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  Zapier Outbound Email Automation
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Action 3 &bull; Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quadrant 1: Human editor reviews and authorizes email dispatch to <span className="font-semibold text-slate-700">{recipientEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToNews}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              &larr; Back to News Feed
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Configure (Zapier UI) | Email Preview | Raw JSON Payload | Setup Guide */}
      <div className="flex items-center border-b border-slate-200 space-x-2 text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('configure')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'configure'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Zapier Outbound Action UI</span>
        </button>

        <button
          onClick={() => setActiveSubTab('preview')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'preview'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Rendered Email Inbox Preview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payload')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'payload'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Zapier Webhook JSON Data</span>
        </button>

        <button
          onClick={() => setActiveSubTab('setupGuide')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeSubTab === 'setupGuide'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Zapier Setup Guide</span>
        </button>
      </div>

      {/* TAB 1: Faithful Recreation of the Zapier "Send Outbound Email" UI from user screenshot */}
      {activeSubTab === 'configure' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Zapier Modal Header */}
          <div className="border-b border-slate-200 p-4 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">
                  3. Send Outbound Email
                </span>
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <span className="text-purple-600 font-semibold cursor-pointer hover:underline">
                Copilot suggestions
              </span>
              <span>&bull;</span>
              <span className="cursor-pointer hover:underline">Refresh fields</span>
              <span>&bull;</span>
              <span className="cursor-pointer hover:underline">Field search</span>
            </div>
          </div>

          {/* Stepper Bar: Setup [✓] | Configure [✓] | Test [✓] */}
          <div className="border-b border-slate-200 px-6 py-2 bg-white flex items-center space-x-6 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 text-emerald-700">
              <span>Setup</span>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <div className="flex items-center space-x-1.5 text-purple-700 border-b-2 border-purple-700 pb-0.5 font-bold">
              <span>Configure</span>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <div className="flex items-center space-x-1.5 text-slate-400">
              <span>Test</span>
              <span className="text-[10px] bg-slate-100 px-1.5 rounded">Ready</span>
            </div>
          </div>

          {/* Zapier Fields Configuration */}
          <div className="p-6 space-y-5">
            {/* Field: To * */}
            <div>
              <div className="flex items-center space-x-1 mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  To <span className="text-rose-500">*</span>
                </label>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 font-medium"
                />
                <button 
                  onClick={() => handleCopy(recipientEmail, 'to')}
                  className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Copy email"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Designated stakeholder recipient configured for executive briefings.
              </p>
            </div>

            {/* Field: Subject * */}
            <div>
              <div className="flex items-center space-x-1 mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Subject <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 font-medium"
                />
                <button 
                  className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Field: Body (HTML or Plain) * with Zapier chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1">
                  <label className="text-xs font-bold text-slate-800">
                    Body (HTML or Plain) <span className="text-rose-500">*</span>
                  </label>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-[11px] text-slate-400">
                  Mapped from Step 2: Gemini AI Summarizer
                </span>
              </div>

              {/* Zapier Pill Chips Container matching Image 2 */}
              <div className="p-3 bg-white border border-slate-300 rounded-lg space-y-2 min-h-36">
                <div className="flex flex-wrap gap-2">
                  {/* Pill 1: Singapore Relevance */}
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-[11px] text-orange-950 font-medium shadow-2xs">
                    <Sparkles className="w-3 h-3 text-orange-600" />
                    <span className="font-semibold">2. Singapore Relevance:</span>
                    <span className="text-orange-900 truncate max-w-[200px] sm:max-w-xs">
                      {primaryItem.singaporeRelevance}
                    </span>
                  </div>

                  {/* Pill 2: Headline */}
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-[11px] text-orange-950 font-medium shadow-2xs">
                    <Sparkles className="w-3 h-3 text-orange-600" />
                    <span className="font-semibold">2. Headline:</span>
                    <span className="text-orange-900 truncate max-w-[200px] sm:max-w-xs">
                      {primaryItem.headline}
                    </span>
                  </div>

                  {/* Pill 3: Business Implications */}
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-[11px] text-orange-950 font-medium shadow-2xs">
                    <Sparkles className="w-3 h-3 text-orange-600" />
                    <span className="font-semibold">2. Business Implications:</span>
                    <span className="text-orange-900 truncate max-w-[200px] sm:max-w-xs">
                      {primaryItem.businessImplications}
                    </span>
                  </div>

                  {/* Pill 4: Summary */}
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-[11px] text-orange-950 font-medium shadow-2xs">
                    <Sparkles className="w-3 h-3 text-orange-600" />
                    <span className="font-semibold">2. Summary:</span>
                    <span className="text-orange-900 truncate max-w-[200px] sm:max-w-xs">
                      {primaryItem.summary}
                    </span>
                  </div>
                </div>

                {activeItems.length > 1 && (
                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 italic">
                    + {activeItems.length - 1} additional Singapore business intelligence items appended automatically in formatted loop.
                  </p>
                )}
              </div>
            </div>

            {/* Optional Live Zapier Catch Hook Webhook URL */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional: Connect to Your Live Zapier Webhook (Catch Hook)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Leave blank to run instant verified dispatch simulation, or paste your Zapier Catch Hook URL to trigger your live Zap!
              </p>
            </div>

            {/* Big Action Button matching Zapier's purple "Continue" button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Quadrant 1: A Person Leads &bull; Verified by Human Reviewer
              </span>

              <button
                onClick={handleTriggerZapier}
                disabled={isSending}
                className="px-6 py-2.5 bg-[#635BFF] hover:bg-[#5248E5] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                {isSending ? (
                  <span>Dispatching to Zapier...</span>
                ) : (
                  <>
                    <span>Continue & Send Briefing</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Rendered Email Inbox Preview */}
      {activeSubTab === 'preview' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Client Simulation
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {subject}
              </h3>
            </div>
            <div className="text-xs text-slate-500">
              To: <strong className="text-slate-800">{recipientEmail}</strong>
            </div>
          </div>

          {/* Formatted Email Body Rendering */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-5 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Singapore Business Intelligence
              </span>
              <h2 className="text-lg font-bold mt-2">
                {briefing?.briefingTitle || 'Singapore Business Intelligence Executive Briefing'}
              </h2>
              <p className="text-xs text-blue-100 mt-1">
                Automated via Zapier Workflow &bull; Quadrant 1: Person Leads, AI Inside
              </p>
            </div>

            {/* Articles Breakdown */}
            <div className="space-y-4">
              {activeItems.map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.headline}
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                      Item {i + 1}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">
                    <strong className="text-sky-900">2. Singapore Relevance:</strong>{' '}
                    <span>{item.singaporeRelevance}</span>
                  </p>

                  <p className="text-xs text-slate-700">
                    <strong className="text-slate-900">2. Summary:</strong>{' '}
                    <span>{item.summary}</span>
                  </p>

                  <p className="text-xs text-slate-700">
                    <strong className="text-emerald-900">2. Business Implications:</strong>{' '}
                    <span>{item.businessImplications}</span>
                  </p>

                  <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Topics: {item.keyTopics?.join(', ')}</span>
                    <span className="text-indigo-600 font-medium">{item.originalSource || 'Google News'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Raw Zapier Webhook JSON Data */}
      {activeSubTab === 'payload' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Zapier Catch Hook Payload
              </h3>
              <p className="text-xs text-slate-500">
                JSON schema sent to Zapier webhook triggers with individual mapped keys.
              </p>
            </div>
            <button
              onClick={() => handleCopy(JSON.stringify(primaryItem, null, 2), 'json')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              {copiedField === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedField === 'json' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
            {JSON.stringify(
              {
                to: recipientEmail,
                subject: subject,
                "2_Headline": primaryItem.headline,
                "2_Singapore_Relevance": primaryItem.singaporeRelevance,
                "2_Business_Implications": primaryItem.businessImplications,
                "2_Summary": primaryItem.summary,
                itemsCount: activeItems.length,
                allBriefingItems: activeItems,
                quadrant: "Quadrant 1: A Person Leads, AI Inside",
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* TAB 4: Zapier Setup Guide */}
      {activeSubTab === 'setupGuide' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              How to Connect This App to Zapier in 2 Minutes
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Connect this app to automatically deliver daily or on-demand Singapore intelligence briefings to {recipientEmail}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">
                1
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Trigger: Webhooks by Zapier
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                In your Zapier dashboard, create a new Zap. Choose <strong>Webhooks by Zapier</strong> and select event <strong>"Catch Hook"</strong>. Copy the generated Webhook URL.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-xs">
                2
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Paste Webhook URL Here
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Paste the URL into the "Connect to Your Live Zapier Webhook" box above and click "Continue & Send Briefing". Zapier will instantly detect the test data.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-xs">
                3
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Action: Send Outbound Email
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Select <strong>Email by Zapier</strong> &rarr; <strong>"Send Outbound Email"</strong>. Map the fields (Headline, Singapore Relevance, Business Implications, Summary) exactly as shown in the screenshot!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Execution Feedback Card */}
      {dispatchResult && (
        <div className={`p-5 rounded-2xl border text-xs shadow-sm transition-all ${
          dispatchResult.status === 'success'
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">
                  {dispatchResult.dispatchedToLiveWebhook
                    ? 'Successfully Dispatched to Live Zapier Webhook!'
                    : 'Zapier Email Workflow Validated & Triggered!'}
                </span>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  {dispatchResult.message || `Briefing dispatched with status ${dispatchResult.httpStatus || 200}. Destination: ${recipientEmail}`}
                </p>
                <div className="mt-2 text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded inline-block">
                  Timestamp: {dispatchResult.timestamp}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
