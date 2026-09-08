const genAI = require('../utils/geminiClient');

const generateEmbedding = async (text) => {
  const response = await genAI.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
};

module.exports = { generateEmbedding };