export const emotionPatterns = {
  enthusiasm: [
    { pattern: /\bgood\b/gi, replacements: ['amazing', 'fantastic', 'awesome'] },
    { pattern: /\bnice\b/gi, replacements: ['brilliant', 'excellent', 'wonderful'] },
  ],
  concern: [
    { pattern: /\bproblem\b/gi, replacements: ['issue', 'challenge', 'difficulty'] },
    { pattern: /\bbad\b/gi, replacements: ['troubling', 'concerning', 'worrying'] },
  ],
  confidence: [
    { pattern: /\bI think\b/gi, replacements: ['I\'m confident', 'I\'m certain', 'I know'] },
    { pattern: /\bmaybe\b/gi, replacements: ['likely', 'probably', 'most likely'] },
  ],
};

export const addPersonalTouch = (text) => {
  const personalPhrases = [
    'In my experience,',
    'I\'ve found that',
    'From what I\'ve seen,',
    'Based on my observation,',
    'Personally,',
  ];
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length > 2 && Math.random() < 0.3) {
    const randomIndex = Math.floor(Math.random() * (sentences.length - 1)) + 1;
    const randomPhrase = personalPhrases[Math.floor(Math.random() * personalPhrases.length)];
    sentences[randomIndex] = randomPhrase + ' ' + sentences[randomIndex].toLowerCase();
  }
  
  return sentences.join('. ') + '.';
};