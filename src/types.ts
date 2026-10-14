export interface NewsArticle {
  id: string;
  title: string;
  originalTitle?: string;
  source: string;
  link: string;
  pubDate: string;
  description?: string;
}

export interface SummarizedItem {
  articleIndex?: number;
  headline: string;
  singaporeRelevance: string;
  summary: string;
  businessImplications: string;
  keyTopics: string[];
  originalSource?: string;
  originalUrl?: string;
}

export interface BriefingResult {
  briefingTitle: string;
  executiveSummary: string;
  quadrantNote: string;
  summaries: SummarizedItem[];
}

export interface ZapierPayload {
  to: string;
  subject: string;
  bodyPlainText: string;
  bodyHtml: string;
  fields: {
    headline: string;
    singaporeRelevance: string;
    businessImplications: string;
    summary: string;
  };
}

export interface TaskClassification {
  taskName: string;
  quadrantNumber: 1 | 2 | 3 | 4;
  quadrantTitle: string;
  answerDimension: 'Work with a right answer' | 'Work with no single right answer';
  collaborationDimension: 'Work that people and AI must do together' | 'Work that either of them can do alone';
  leadershipArchetype: string;
  humanRole: string;
  aiRole: string;
  whyThisQuadrant: string;
  keyRisks?: string;
  practicalRecommendation: string;
}
