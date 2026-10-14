import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Check, 
  ExternalLink, 
  Clock, 
  Send, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  Search,
  BookOpen
} from 'lucide-react';
import { NewsArticle, BriefingResult, SummarizedItem } from '../types';

interface NewsSummarizerProps {
  onSummarized: (result: BriefingResult) => void;
  onProceedToZapier: () => void;
  currentBriefing: BriefingResult | null;
}

const DEFAULT_RSS_URL = 'https://news.google.com/rss/search?q=Singapore+business&hl=en-SG&gl=SG&ceid=SG:en';

export const NewsSummarizer: React.FC<NewsSummarizerProps> = ({
  onSummarized,
  onProceedToZapier,
  currentBriefing,
}) => {
  const [rssUrl, setRssUrl] = useState(DEFAULT_RSS_URL);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editedBriefing, setEditedBriefing] = useState<BriefingResult | null>(currentBriefing);

  // Sync editedBriefing if parent prop changes
  useEffect(() => {
    if (currentBriefing) {
      setEditedBriefing(currentBriefing);
    }
  }, [currentBriefing]);

  // Fetch RSS news on mount
  const fetchNews = async (targetUrl = rssUrl) => {
    setIsLoadingNews(true);
    setError(null);
    try {
      const res = await fetch(`/api/news/rss?url=${encodeURIComponent(targetUrl)}`);
      if (!res.ok) {
        throw new Error(`Failed to load RSS feed (${res.status})`);
      }
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        // Pre-select top 4 articles for optimal executive briefing size
        setSelectedIds(data.articles.slice(0, 4).map((a: NewsArticle) => a.id));
      } else {
        setArticles([]);
        setError('No articles found in this RSS feed.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching Singapore business news RSS.');
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const toggleSelectArticle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectTop = (count: number) => {
    setSelectedIds(articles.slice(0, count).map((a) => a.id));
  };

  // Run Gemini News Summarizer
  const handleSummarize = async () => {
    const selectedArticles = articles.filter((a) => selectedIds.includes(a.id));
    if (selectedArticles.length === 0) {
      setError('Please select at least one article to summarize.');
      return;
    }

    setIsSummarizing(true);
    setError(null);

    try {
      const res = await fetch('/api/summarize-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articles: selectedArticles,
          customInstructions: customInstructions.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Summarization failed');
      }

      const data = await res.json();
      if (data.briefing) {
        setEditedBriefing(data.briefing);
        onSummarized(data.briefing);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate AI summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleUpdateItem = (index: number, updated: Partial<SummarizedItem>) => {
    if (!editedBriefing) return;
    const newSummaries = [...editedBriefing.summaries];
    newSummaries[index] = { ...newSummaries[index], ...updated };
    const updatedBriefing = { ...editedBriefing, summaries: newSummaries };
    setEditedBriefing(updatedBriefing);
    onSummarized(updatedBriefing);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Step 1: Quadrant 1 Context Callout */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-purple-500/30 text-purple-200 border border-purple-400/40">
                Quadrant 1 Workflow
              </span>
              <span className="text-xs text-slate-300">
                A Person Leads &bull; AI Inside
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Singapore Business News Summarization
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Google News RSS feed ingestion transformed into simple terms, key topics, Singapore relevance, and business impact &mdash; ready for human sign-off and Zapier outbound dispatch.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {editedBriefing && (
              <button
                onClick={onProceedToZapier}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Zapier Dispatch</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RSS Feed & Ingestion Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Google News RSS Ingestion Engine
              </h2>
              <p className="text-xs text-slate-500">
                Targeting Singapore commercial, financial, and regulatory headlines
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchNews(DEFAULT_RSS_URL)}
              disabled={isLoadingNews}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNews ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>

        {/* RSS Feed URL bar */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            RSS Feed Endpoint
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://news.google.com/rss/search?q=..."
            />
            <button
              onClick={() => fetchNews(rssUrl)}
              disabled={isLoadingNews}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer disabled:opacity-50"
            >
              Fetch
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Preset query: <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">q=Singapore+business&hl=en-SG&gl=SG&ceid=SG:en</code>
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Article Selection Matrix */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800">
                Fetched Live Articles ({articles.length})
              </span>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {selectedIds.length} Selected for AI Briefing
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-400 mr-1">Quick Select:</span>
              <button
                onClick={() => selectTop(3)}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium cursor-pointer"
              >
                Top 3
              </button>
              <button
                onClick={() => selectTop(5)}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium cursor-pointer"
              >
                Top 5
              </button>
              <button
                onClick={() => setSelectedIds(articles.map((a) => a.id))}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium cursor-pointer"
              >
                All
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* List of Articles */}
          {isLoadingNews ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="text-xs text-slate-500 font-medium">
                Connecting to Google News Singapore Business RSS...
              </p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
              {articles.map((article) => {
                const isSelected = selectedIds.includes(article.id);
                return (
                  <div
                    key={article.id}
                    onClick={() => toggleSelectArticle(article.id)}
                    className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900 line-clamp-1">
                          {article.title}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0 font-medium">
                          {article.source}
                        </span>
                      </div>
                      {article.description && (
                        <p className="text-slate-500 mt-1 line-clamp-1 text-[11px]">
                          {article.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                        </span>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-indigo-600 hover:underline flex items-center space-x-0.5"
                        >
                          <span>Original Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom prompt tweaks */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Optional: Custom focus (e.g. emphasize impact on FinTech, MAS interest rates, REITs)..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleSummarize}
            disabled={isSummarizing || selectedIds.length === 0}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSummarizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Inside Synthesizing ({selectedIds.length} Articles)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Summarize in Simple Terms & Impact</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step 2: The Generated Executive Briefing & Human Review Studio ("A Person Leads") */}
      {editedBriefing && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Ready for Human Review
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {editedBriefing.summaries.length} Intelligence Items Synthesized
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {editedBriefing.briefingTitle}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onProceedToZapier}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <span>Stage in Zapier Email Dispatcher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* High-level Executive Summary */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Macro Synthesis
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {editedBriefing.executiveSummary}
            </p>
            {editedBriefing.quadrantNote && (
              <p className="text-[11px] text-purple-700 mt-2 font-mono bg-purple-50 p-2 rounded-lg border border-purple-200/60">
                {editedBriefing.quadrantNote}
              </p>
            )}
          </div>

          {/* Individual Summarized Cards with user edit ability */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Detailed Briefing Breakdown &bull; Formatted for Zapier Fields
              </h3>
              <span className="text-[11px] text-slate-500">
                Click any section or edit button to customize before email dispatch
              </span>
            </div>

            {editedBriefing.summaries.map((item, idx) => {
              const isEditing = editingItemIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                        {idx + 1}
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.headline}
                          onChange={(e) => handleUpdateItem(idx, { headline: e.target.value })}
                          className="text-sm font-bold text-slate-900 border border-indigo-400 rounded px-2 py-1 w-full max-w-md focus:outline-none"
                        />
                      ) : (
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.headline}
                        </h4>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingItemIndex(isEditing ? null : idx)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        {isEditing ? (
                          <>
                            <Save className="w-3 h-3 text-emerald-600" />
                            <span>Save</span>
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-3 h-3 text-slate-500" />
                            <span>Edit</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* The 4 Core Fields from the user's Zapier spec */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* 1. Singapore Relevance */}
                    <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200/80">
                      <span className="font-bold text-sky-950 block mb-1 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        <span>Singapore Relevance</span>
                      </span>
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={item.singaporeRelevance}
                          onChange={(e) => handleUpdateItem(idx, { singaporeRelevance: e.target.value })}
                          className="w-full text-xs text-sky-900 bg-white border border-sky-300 rounded p-1.5 focus:outline-none"
                        />
                      ) : (
                        <p className="text-sky-900 leading-relaxed">
                          {item.singaporeRelevance}
                        </p>
                      )}
                    </div>

                    {/* 2. Business Implications */}
                    <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                      <span className="font-bold text-emerald-950 block mb-1 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Business Implications</span>
                      </span>
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={item.businessImplications}
                          onChange={(e) => handleUpdateItem(idx, { businessImplications: e.target.value })}
                          className="w-full text-xs text-emerald-900 bg-white border border-emerald-300 rounded p-1.5 focus:outline-none"
                        />
                      ) : (
                        <p className="text-emerald-900 leading-relaxed">
                          {item.businessImplications}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 3. Summary in Simple Terms */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1 flex items-center space-x-1 text-xs">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Summary (In Simple Terms)</span>
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={item.summary}
                        onChange={(e) => handleUpdateItem(idx, { summary: e.target.value })}
                        className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded p-1.5 focus:outline-none"
                      />
                    ) : (
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {item.summary}
                      </p>
                    )}
                  </div>

                  {/* Footer tags and links */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400">Key Topics:</span>
                      {item.keyTopics?.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {item.originalUrl && (
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline flex items-center space-x-1"
                      >
                        <span>{item.originalSource || 'Original Article'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action to zapier */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onProceedToZapier}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              <span>Dispatch Briefing via Zapier Outbound Email</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
