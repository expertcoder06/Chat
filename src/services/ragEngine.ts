import { AEC_KNOWLEDGE_DOCS, KnowledgeDocument } from './knowledgeBase';
import { ChatMessage, RagBackendConfig, RetrievedSource } from '../types/chat';

export const DEFAULT_RAG_CONFIG: RagBackendConfig = {
  mode: 'mock_local',
  customApiUrl: 'http://localhost:8000/api/rag-chat',
  apiKey: '',
  vectorDb: 'chroma',
  collectionName: 'aec_knowledge_base',
  topK: 4,
  similarityThreshold: 0.65,
  temperature: 0.3,
  systemPrompt: `You are the official AI Student Assistant for Asansol Engineering College (AEC), Asansol, West Bengal (Affiliated to MAKAUT, NBA Accredited, ESTD 1998). Answer student queries accurately, politely, and thoroughly using only verified college guidelines, admissions rules, fee schedules, course matrices, and placement data. Always cite official document sources when providing factual details.`,
  streamResponse: false,
  timeoutSeconds: 15,
  customHeadersJson: '{\n  "Content-Type": "application/json"\n}'
};

/**
 * Computes hybrid keyword + semantic similarity simulation between query and document.
 */
export function calculateRelevance(query: string, doc: KnowledgeDocument): { score: number; matchedKeywords: string[] } {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (queryTokens.length === 0) {
    return { score: 0.4, matchedKeywords: [] };
  }

  let matchPoints = 0;
  const matchedKeywords: string[] = [];

  // Check document keywords
  for (const kw of doc.keywords) {
    if (normalizedQuery.includes(kw)) {
      matchPoints += 3;
      matchedKeywords.push(kw);
    }
  }

  // Check document title
  const docTitleLower = doc.title.toLowerCase();
  for (const token of queryTokens) {
    if (docTitleLower.includes(token)) {
      matchPoints += 2.5;
    }
  }

  // Check document content
  const docContentLower = doc.content.toLowerCase();
  for (const token of queryTokens) {
    if (docContentLower.includes(token)) {
      matchPoints += 1;
    }
  }

  // Normalize to 0.50 - 0.98 range
  const rawScore = matchPoints / (queryTokens.length * 3 + 2);
  const normalizedScore = Math.min(0.96, Math.max(0.52, 0.55 + rawScore * 0.42));

  return {
    score: parseFloat(normalizedScore.toFixed(3)),
    matchedKeywords
  };
}

/**
 * Retrieves the most relevant knowledge base chunks matching a query.
 */
export function retrieveLocalSources(query: string, topK: number = 4, threshold: number = 0.60): RetrievedSource[] {
  const scoredDocs = AEC_KNOWLEDGE_DOCS.map((doc, idx) => {
    const { score, matchedKeywords } = calculateRelevance(query, doc);
    return {
      doc,
      score,
      matchedKeywords,
      idx
    };
  });

  // Sort by score descending
  scoredDocs.sort((a, b) => b.score - a.score);

  // Filter by threshold (keep at least 1 top document if above 0.52)
  const filtered = scoredDocs.filter((item, i) => item.score >= threshold || i === 0);

  return filtered.slice(0, topK).map((item, index) => {
    // Generate clean snippet focusing around matched content
    let snippet = item.doc.content;
    if (snippet.length > 260) {
      snippet = snippet.substring(0, 250) + '...';
    }

    return {
      id: `chunk-${item.doc.id}-${index}`,
      documentTitle: item.doc.title,
      category: item.doc.category,
      pageOrSection: item.doc.section,
      similarityScore: item.score,
      snippet: snippet,
      sourceUrl: item.doc.sourceUrl,
      chunkIndex: index + 1
    };
  });
}

/**
 * Synthesizes an intelligent, well-structured response based on retrieved AEC sources.
 */
export function generateLocalRAGAnswer(query: string, sources: RetrievedSource[]): string {
  const q = query.toLowerCase();

  // Check specific common intents
  if (q.includes('fee') || q.includes('cost') || q.includes('tuition')) {
    return `### Asansol Engineering College Fee Structure (2024-25)

The approved fee structure as per West Bengal Fee Regulatory Committee & MAKAUT is outlined below:

- **1st Semester (Admission + Tuition):** Approx **₹55,000 – ₹62,000** (inclusive of one-time refundable caution deposit, uniform, and MAKAUT student registration fee).
- **2nd to 8th Semesters:** Approx **₹45,000 – ₹48,000** per semester.
- **Estimated Total 4-Year B.Tech Tuition:** **₹3,80,000 – ₹4,10,000**.
- **Hostel & Food Charges:** Approx **₹28,000 – ₹32,000** per semester (includes lodging, 4-time nutritious meals, Wi-Fi, and 24x7 power backup).

*Note: University examination fees are paid separately per semester via the MAKAUT online portal.*`;
  }

  if (q.includes('placement') || q.includes('package') || q.includes('recruit') || q.includes('salary') || q.includes('job')) {
    return `### AEC Training & Placement Highlights

Asansol Engineering College maintains a strong placement track record across IT services, software product companies, and core engineering giants:

- **Placement Rate:** Over **78%** of eligible students secured job offers across campus drives.
- **Highest Package:** **₹18.5 LPA to ₹24 LPA** in recent recruitment cycles.
- **Average Package:** **₹4.8 LPA to ₹5.2 LPA**.
- **Top Recruiters:**
  - *Tier 1 IT & Consulting:* **TCS (Digital & Ninja), Cognizant (GenC / GenC Next), Wipro (Turbo / Elite), Infosys, Capgemini, IBM India, Persistent Systems, Hexaware**.
  - *Core & Automation:* **L&T Infotech, Pinnacle Infotech, Tech Mahindra, Mindtree**.
- **Pre-Placement Bootcamps:** AEC runs dedicated aptitude preparation, mock coding challenges (LeetCode / HackerRank style), and soft skills grooming starting from the 5th semester.`;
  }

  if (q.includes('branch') || q.includes('course') || q.includes('seat') || q.includes('intake') || q.includes('department')) {
    return `### Academic Programs & Seat Intake at AEC

AEC offers 4-year B.Tech degrees affiliated with **MAKAUT** and approved by **AICTE**, with NBA accreditation in key engineering streams:

| Department / Stream | Degree | Annual Seat Intake |
| :--- | :--- | :--- |
| **Computer Science & Engineering (CSE)** | B.Tech | 180 Seats |
| **Information Technology (IT)** | B.Tech | 90 Seats |
| **Electronics & Communication (ECE)** | B.Tech | 120 Seats |
| **Electrical Engineering (EE)** | B.Tech | 90 Seats |
| **Mechanical Engineering (ME)** | B.Tech | 60 Seats |
| **Civil Engineering (CE)** | B.Tech | 60 Seats |
| **CSE (Artificial Intelligence & ML)** | B.Tech | 60 Seats |
| **CSE (Internet of Things - IoT)** | B.Tech | 60 Seats |

**Postgraduate & Professional Programs:**
- **MCA (Master of Computer Applications):** 60 Seats (2-Year)
- **BCA (Bachelor of Computer Applications):** 90 Seats
- **BBA (Bachelor of Business Administration):** 60 Seats`;
  }

  if (q.includes('admission') || q.includes('eligib') || q.includes('wbjee') || q.includes('jee') || q.includes('jelet') || q.includes('cutoff')) {
    return `### B.Tech Admission & Eligibility Guidelines (2024-25)

**1. Basic Eligibility:**
- Must pass **10+2 (Higher Secondary)** with Physics & Mathematics as compulsory subjects, plus Chemistry / Biotechnology / Biology / Computer Science.
- Minimum aggregate: **45% marks** in the three combined subjects (**40%** for reserved categories SC/ST/OBC-A/OBC-B).
- Must have passed English with at least 30% marks.

**2. Allotment Channels:**
- **90% Seats:** Allotted through Centralized Online Counseling conducted by **WBJEEB** based on **WBJEE General Merit Rank (GMR)**.
- **10% Seats:** Allotted via **JEE Main Rank** through WBJEEB counseling.
- **Lateral Entry (2nd Year B.Tech):** Offered for 3-year Polytechnic Diploma holders and B.Sc graduates through **JELET** rank counseling.

*For decentralized vacant seat counseling or management queries, reach the admission helpline at +91 9434005886 / admission@aecwb.edu.in.*`;
  }

  if (q.includes('hostel') || q.includes('library') || q.includes('campus') || q.includes('facility') || q.includes('life')) {
    return `### AEC Campus Amenities & Residential Facilities

- **Separate Hostels:** Modern boys' and girls' hostels situated safely on or near campus with 24x7 security, CCTV surveillance, continuous Wi-Fi, study lounges, and hygienic catering.
- **Central Digital Library:** Spanning over 70,000+ volumes, 2,500+ CD-ROMs, air-conditioned reading rooms, and online access to IEEE Xplore, DELNET, and ScienceDirect.
- **Computing Infrastructure:** Over 1,000 high-performance computer terminals connected with 1 Gbps dedicated high-speed fiber-optic line.
- **Sports & Recreation:** Spacious cricket and football grounds, basketball and volleyball courts, table tennis, and fully equipped student gymnasium.
- **Student Clubs & Fests:**
  - *LEGENZA:* Annual grand cultural festival with live bands and performing arts.
  - *ANWESAN:* Annual inter-college technical hackathon, robotics wars, and coding marathons.
  - *Student Chapters:* Active Google Developer Student Club (GDSC), IEEE Student Branch, and Robotics Club.`;
  }

  if (q.includes('contact') || q.includes('reach') || q.includes('phone') || q.includes('address') || q.includes('email') || q.includes('where')) {
    return `### Asansol Engineering College Contact Directory

- **Campus Address:** Vivekananda Sarani, Kanyapur, Asansol - 713305, Paschim Bardhaman, West Bengal, India.
- **Phone Lines:** (0341) 2253057 / 2252108
- **Admission Helplines:** +91 9434005886 / +91 9434005887 / +91 7001460515
- **Official Emails:** \`admission@aecwb.edu.in\` / \`principal.aecwb@gmail.com\`
- **Placement Cell:** \`tpo@aecwb.edu.in\`
- **Official Website:** [www.aecwb.edu.in](http://www.aecwb.edu.in/)
- **How to Reach:** Located approximately 5 km from Asansol Junction (ASN Railway Station) and 3 km from NH-19 (GT Road bypass). Regular e-rickshaws, autos, and local buses connect directly to Kanyapur campus.`;
  }

  if (q.includes('exam') || q.includes('mar') || q.includes('mooc') || q.includes('routine') || q.includes('ca')) {
    return `### Examination & MAKAUT Academic Rules

Asansol Engineering College follows the academic regulations of Maulana Abul Kalam Azad University of Technology (MAKAUT):

- **Continuous Assessment (CA):** 4 Continuous Assessments (CA1 to CA4) are conducted per semester. Teachers evaluate quizzes, presentations, assignments, and mid-term tests.
- **Practical Assessment (PCA):** PCA1 and PCA2 evaluate hands-on laboratory mastery and project logbooks.
- **Mandatory Additional Requirements (MAR):** Every B.Tech student must accumulate **100 MAR points** across 4 years (25 points/year) through social internships, blood donation, MOOCs, hackathons, sports, or technical paper presentations.
- **Grading Scale:** 10-point SGPA and CGPA system with semester-end theory and viva exams.`;
  }

  // Generic synthesis based on the top sources
  if (sources.length > 0) {
    const topDoc = sources[0];
    return `Based on verified Asansol Engineering College records from **${topDoc.documentTitle}** (${topDoc.pageOrSection}):

${topDoc.snippet}

Key facts to note:
- AEC is an AICTE-approved and MAKAUT-affiliated institution established in 1998, situated at Kanyapur, Asansol.
- For detailed branch curriculum, fee schedules, or WBJEE counseling updates, you can consult the Admissions Office or visit [www.aecwb.edu.in](http://www.aecwb.edu.in/).

Feel free to ask about specific cutoff ranks, branch syllabi, hostel facilities, or placement records!`;
  }

  return `Welcome to the Asansol Engineering College Student AI Assistant! I can help you with:
- **B.Tech & Lateral Entry Admissions (WBJEE / JEE Main)**
- **Department Courses & Seat Matrix (CSE, IT, ECE, AIML, EE, ME, CE)**
- **Tuition & Hostel Fee Schedules**
- **Placement Records & Top Hiring Companies (TCS, Cognizant, Wipro, Infosys)**
- **MAKAUT Exam Rules, CA/PCA Marks, and MAR Points**

Please ask any question regarding AEC campus, or select one of the quick suggestions above!`;
}

/**
 * Dispatches a query to either:
 * 1. User's custom RAG backend (FastAPI, Flask, LangChain, etc.)
 * 2. In-memory simulated AEC vector store (Mock Local)
 */
export async function queryRagPipeline(
  query: string,
  config: RagBackendConfig,
  history: ChatMessage[]
): Promise<{
  text: string;
  sources: RetrievedSource[];
  latencyMs: number;
  tokensUsed: number;
}> {
  const startTime = performance.now();

  // Mode 1: Custom external API backend
  if (config.mode === 'custom_api') {
    try {
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (config.apiKey) {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      if (config.customHeadersJson) {
        try {
          const parsed = JSON.parse(config.customHeadersJson);
          headers = { ...headers, ...parsed };
        } catch {
          // Keep default headers if json parse fails
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), (config.timeoutSeconds || 15) * 1000);

      const requestPayload = {
        query: query,
        collection_name: config.collectionName,
        vector_db: config.vectorDb,
        top_k: config.topK,
        similarity_threshold: config.similarityThreshold,
        temperature: config.temperature,
        system_prompt: config.systemPrompt,
        history: history.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      };

      const response = await fetch(config.customApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Custom backend returned HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      const endTime = performance.now();

      // Normalize response from various RAG framework formats
      const answerText = data.response || data.answer || data.text || data.message || (typeof data === 'string' ? data : JSON.stringify(data));

      let sources: RetrievedSource[] = [];
      const rawSources = data.sources || data.context_chunks || data.retrieved_documents || data.chunks || [];

      if (Array.isArray(rawSources)) {
        sources = rawSources.map((s: any, idx: number) => ({
          id: s.id || `custom-chunk-${idx}`,
          documentTitle: s.title || s.document || s.document_title || `Document ${idx + 1}`,
          category: s.category || 'Academics',
          pageOrSection: s.section || s.page || `Chunk ${idx + 1}`,
          similarityScore: typeof s.score === 'number' ? s.score : 0.88,
          snippet: s.snippet || s.text || s.content || '',
          sourceUrl: s.url || s.source_url
        }));
      }

      return {
        text: answerText,
        sources,
        latencyMs: Math.round(endTime - startTime),
        tokensUsed: data.tokens_used || Math.round((query.length + answerText.length) / 4)
      };
    } catch (err: any) {
      const endTime = performance.now();
      // Provide actionable, graceful error with fallback to local knowledge
      const errorMessage = `⚠️ Custom RAG Endpoint Error: ${err.message || 'Unable to connect to ' + config.customApiUrl}. Falling back to internal AEC knowledge base for this response.\n\n` +
        generateLocalRAGAnswer(query, retrieveLocalSources(query, config.topK, config.similarityThreshold));

      return {
        text: errorMessage,
        sources: retrieveLocalSources(query, config.topK, config.similarityThreshold),
        latencyMs: Math.round(endTime - startTime),
        tokensUsed: 120
      };
    }
  }

  // Mode 2: Local in-memory AEC Vector Store & Knowledge Base
  // Simulate vector similarity search and generation latency (~250-400ms)
  await new Promise((resolve) => setTimeout(resolve, 220));

  const sources = retrieveLocalSources(query, config.topK, config.similarityThreshold);
  const text = generateLocalRAGAnswer(query, sources);
  const endTime = performance.now();

  return {
    text,
    sources,
    latencyMs: Math.round(endTime - startTime),
    tokensUsed: Math.round((query.length + text.length) / 3.8)
  };
}

/**
 * Pings user's custom endpoint to verify health and latency.
 */
export async function testCustomBackendConnection(config: RagBackendConfig): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
}> {
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const testPayload = {
      query: 'ping_healthcheck_test',
      collection_name: config.collectionName,
      top_k: 1
    };

    const res = await fetch(config.customApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const latency = Math.round(performance.now() - startTime);

    if (res.ok) {
      return {
        success: true,
        message: `Connected successfully! (HTTP ${res.status}, ${latency}ms)`,
        latencyMs: latency
      };
    } else {
      return {
        success: false,
        message: `Endpoint reachable but returned HTTP ${res.status}: ${res.statusText}`,
        latencyMs: latency
      };
    }
  } catch (err: any) {
    const latency = Math.round(performance.now() - startTime);
    return {
      success: false,
      message: `Failed to connect: ${err.message || 'Network error / CORS blocked or server not running.'}`,
      latencyMs: latency
    };
  }
}

/**
 * Generates ready-to-copy Python FastAPI / Flask / LangChain starter code
 * so the user can easily deploy or test their backend pipeline.
 */
export function generateApiExampleCode(config: RagBackendConfig): string {
  return `"""
Asansol Engineering College (AEC) RAG Backend Starter
Framework: FastAPI + LangChain / ChromaDB + Any LLM
Install: pip install fastapi uvicorn langchain chromadb pydantic sentence-transformers
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(title="AEC College RAG Backend API", version="1.0.0")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatHistoryItem(BaseModel):
    role: str
    content: str

class RagRequest(BaseModel):
    query: str
    collection_name: Optional[str] = "${config.collectionName}"
    top_k: Optional[int] = ${config.topK}
    similarity_threshold: Optional[float] = ${config.similarityThreshold}
    temperature: Optional[float] = ${config.temperature}
    system_prompt: Optional[str] = None
    history: Optional[List[ChatHistoryItem]] = []

class RetrievedChunk(BaseModel):
    id: str
    title: str
    section: str
    score: float
    snippet: str
    url: Optional[str] = None

class RagResponse(BaseModel):
    response: str
    sources: List[RetrievedChunk]
    latency_ms: int
    tokens_used: int

@app.post("/api/rag-chat", response_model=RagResponse)
async def handle_rag_chat(req: RagRequest):
    start = time.time()
    
    # 1. Embed query using your embedding model (e.g., text-embedding-3-small, BAAI/bge-small-en)
    # query_embedding = embed_model.encode(req.query)
    
    # 2. Query your Vector DB (ChromaDB / Pinecone / Qdrant)
    # results = vector_db.query(query_embedding, top_k=req.top_k)
    
    # Example simulated retrieved chunks from AEC college documents
    sources = [
        RetrievedChunk(
            id="chunk-aec-01",
            title="AEC Admission Prospectus 2024-25",
            section="Section 2.1 - B.Tech Eligibility & WBJEE",
            score=0.912,
            snippet="Candidates require 45% in 10+2 with Physics & Math. 90% seats through WBJEE counseling, 10% via JEE Main.",
            url="http://www.aecwb.edu.in/admission"
        ),
        RetrievedChunk(
            id="chunk-aec-02",
            title="AEC Training & Placement Annual Report",
            section="Section 4.0 - Placements & Recruiters",
            score=0.865,
            snippet="Top recruiters include TCS, Cognizant, Wipro, Infosys, Capgemini. Highest package reached 24 LPA.",
            url="http://www.aecwb.edu.in/placement"
        )
    ]
    
    # 3. Call your LLM (Gemini, Llama 3, Mistral, OpenAI) with Prompt + Context
    # prompt = build_rag_prompt(req.system_prompt, sources, req.query, req.history)
    # llm_answer = llm.generate(prompt)
    llm_answer = (
        f"Thank you for contacting Asansol Engineering College. "
        f"Regarding '{req.query}': AEC offers comprehensive 4-year B.Tech degrees affiliated to MAKAUT "
        f"with high placement statistics (TCS, Cognizant, Wipro). "
        f"For admissions, WBJEE and JEE Main ranks are utilized."
    )
    
    latency = int((time.time() - start) * 1000)
    
    return RagResponse(
        response=llm_answer,
        sources=sources,
        latency_ms=latency,
        tokens_used=185
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`;
}
