export interface RetrievedSource {
  id: string;
  documentTitle: string;
  category: 'Admissions' | 'Academics' | 'Placements' | 'Campus Life' | 'Examinations' | 'Administration';
  pageOrSection: string;
  similarityScore: number; // 0 to 1
  snippet: string;
  sourceUrl?: string;
  chunkIndex?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  sources?: RetrievedSource[];
  latencyMs?: number;
  tokensUsed?: number;
  feedback?: 'up' | 'down';
  feedbackReason?: string;
  isStreaming?: boolean;
}

export type BackendMode = 'mock_local' | 'custom_api' | 'gemini_direct';

export interface RagBackendConfig {
  mode: BackendMode;
  customApiUrl: string;
  apiKey: string;
  vectorDb: 'chroma' | 'pinecone' | 'qdrant' | 'faiss' | 'weaviate' | 'pgvector' | 'custom';
  collectionName: string;
  topK: number;
  similarityThreshold: number;
  temperature: number;
  systemPrompt: string;
  streamResponse: boolean;
  timeoutSeconds: number;
  customHeadersJson?: string;
}

export interface CollegeNotice {
  id: string;
  title: string;
  date: string;
  category: 'Exam' | 'Admission' | 'Placement' | 'Event' | 'General';
  isUrgent?: boolean;
  linkText?: string;
  queryTrigger: string;
}

export interface DepartmentInfo {
  code: string;
  name: string;
  intake: number;
  established: number;
  highlights: string[];
  hodName: string;
}
