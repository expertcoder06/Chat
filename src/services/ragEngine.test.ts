import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRelevance, retrieveLocalSources, generateLocalRAGAnswer, DEFAULT_RAG_CONFIG, generateApiExampleCode } from './ragEngine';
import { AEC_KNOWLEDGE_DOCS } from './knowledgeBase';

test('calculateRelevance matches relevant keywords in AEC documents', () => {
  const placementDoc = AEC_KNOWLEDGE_DOCS.find((d) => d.id === 'aec-placements-05')!;
  assert.ok(placementDoc, 'Placement doc should exist');

  const { score, matchedKeywords } = calculateRelevance('What is the highest placement package and salary?', placementDoc);
  assert.ok(score > 0.65, `Score should be elevated for placement query, got ${score}`);
  assert.ok(matchedKeywords.includes('placement') || matchedKeywords.includes('package') || matchedKeywords.includes('salary'), 'Should match placement keywords');
});

test('retrieveLocalSources returns top-k chunks with scores and snippets', () => {
  const sources = retrieveLocalSources('How to get admission through WBJEE rank and eligibility?', 3);
  assert.ok(sources.length > 0 && sources.length <= 3, 'Should return up to 3 sources');
  assert.ok(sources[0].similarityScore >= 0.5, 'Top source should have valid similarity score');
  assert.ok(sources[0].snippet.length > 20, 'Snippet should have text');
  assert.ok(sources[0].documentTitle.length > 0, 'Document title should not be empty');
});

test('generateLocalRAGAnswer provides structured response for fees query', () => {
  const sources = retrieveLocalSources('What are the semester tuition fees?', 2);
  const answer = generateLocalRAGAnswer('What are the semester tuition fees?', sources);

  assert.ok(answer.includes('Fee Structure'), 'Answer should mention fee structure');
  assert.ok(answer.includes('B.Tech'), 'Answer should mention B.Tech');
});

test('generateApiExampleCode outputs valid Python FastAPI snippet', () => {
  const code = generateApiExampleCode(DEFAULT_RAG_CONFIG);
  assert.ok(code.includes('from fastapi import FastAPI'), 'Should import FastAPI');
  assert.ok(code.includes('collection_name'), 'Should include collection_name');
  assert.ok(code.includes('CORSMiddleware'), 'Should configure CORS');
});
