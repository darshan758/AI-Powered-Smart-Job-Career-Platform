const pineconeIndex = require('../utils/pineconeClient');
const { generateEmbedding } = require('./embeddingService');

// Store/update a vector for a resume or job posting
const upsertVector = async (id, text, metadata = {}) => {
  const embedding = await generateEmbedding(text);

  await pineconeIndex.upsert([
    {
      id, // unique identifier — we'll use the MongoDB document's _id as a string
      values: embedding,
      metadata, // extra info returned alongside search results (e.g. type: 'resume' or 'job')
    },
  ]);
};

// Find the most similar vectors to a given piece of text
const findSimilar = async (text, topK = 5, filter = {}) => {
  const embedding = await generateEmbedding(text);

  const results = await pineconeIndex.query({
    vector: embedding,
    topK,
    includeMetadata: true,
    filter, // e.g. { type: 'job' } to only search job postings
  });

  return results.matches; // array of { id, score, metadata }
};

// Fetch a specific vector by its ID (no search, just direct lookup)
const getVectorById = async (id) => {
  const result = await pineconeIndex.fetch({ ids: [id] });
  const record = result.records[id];
  return record ? record.values : null;
};

// Cosine similarity between two equal-length vectors — returns a value from -1 to 1
// (in practice, for text embeddings, almost always between 0 and 1)
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

module.exports = { upsertVector, findSimilar, getVectorById, cosineSimilarity };