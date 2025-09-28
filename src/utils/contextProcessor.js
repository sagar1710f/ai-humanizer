export const contextualReplacements = {
  academic: {
    patterns: [
      { pattern: /\bresearch shows\b/gi, replacements: ['studies indicate', 'findings suggest', 'evidence points to'] },
      { pattern: /\bin order to\b/gi, replacements: ['to', 'so we can', 'for'] },
      { pattern: /\butilize\b/gi, replacements: ['use', 'apply', 'employ'] },
    ]
  },
  casual: {
    patterns: [
      { pattern: /\bvery important\b/gi, replacements: ['super important', 'really key', 'crucial'] },
      { pattern: /\bI believe\b/gi, replacements: ['I think', 'I feel like', 'seems to me'] },
      { pattern: /\bunfortunately\b/gi, replacements: ['sadly', 'too bad', 'bummer is'] },
    ]
  },
  business: {
    patterns: [
      { pattern: /\bimplement\b/gi, replacements: ['put in place', 'set up', 'roll out'] },
      { pattern: /\boptimize\b/gi, replacements: ['improve', 'enhance', 'boost'] },
      { pattern: /\bsynergize\b/gi, replacements: ['work together', 'combine', 'team up'] },
    ]
  }
};

export const detectContext = (text) => {
  const academicWords = ['research', 'study', 'analysis', 'methodology', 'findings'];
  const casualWords = ['yeah', 'awesome', 'cool', 'hey', 'basically'];
  const businessWords = ['revenue', 'ROI', 'synergy', 'optimize', 'leverage'];
  
  const words = text.toLowerCase().split(/\s+/);
  
  let academicScore = 0;
  let casualScore = 0;
  let businessScore = 0;
  
  words.forEach(word => {
    if (academicWords.includes(word)) academicScore++;
    if (casualWords.includes(word)) casualScore++;
    if (businessWords.includes(word)) businessScore++;
  });
  
  const maxScore = Math.max(academicScore, casualScore, businessScore);
  
  if (academicScore === maxScore) return 'academic';
  if (casualScore === maxScore) return 'casual';
  if (businessScore === maxScore) return 'business';
  
  return 'general';
};