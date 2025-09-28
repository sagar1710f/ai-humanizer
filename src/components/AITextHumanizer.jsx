import React, { useState, useCallback } from 'react';
import { Copy, RefreshCw, FileText, CheckCircle, Zap, Users, Shield } from 'lucide-react';

const AITextHumanizer = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [processingStep, setProcessingStep] = useState('');

    // AI-specific patterns that make text sound robotic
    const aiPatterns = [
        // Common AI phrases
        { pattern: /In conclusion,/gi, replacements: ['To wrap up,', 'Finally,', 'To sum things up,', 'Overall,'], category: 'conclusion' },
        { pattern: /Furthermore,/gi, replacements: ['Also,', 'Plus,', 'What\'s more,', 'Additionally,'], category: 'transition' },
        { pattern: /Moreover,/gi, replacements: ['Also,', 'Besides that,', 'On top of that,', 'Plus,'], category: 'transition' },
        { pattern: /It is important to note that/gi, replacements: ['Worth mentioning:', 'Keep in mind that', 'Remember that', 'Note that'], category: 'emphasis' },
        { pattern: /It should be noted that/gi, replacements: ['Worth pointing out:', 'Remember that', 'Keep in mind:', 'Note that'], category: 'emphasis' },
        { pattern: /In today\'s digital age/gi, replacements: ['These days', 'Nowadays', 'In our connected world', 'Today'], category: 'temporal' },
        { pattern: /cutting-edge/gi, replacements: ['advanced', 'modern', 'latest', 'innovative'], category: 'adjective' },
        { pattern: /state-of-the-art/gi, replacements: ['advanced', 'modern', 'top-notch', 'high-end'], category: 'adjective' },
        { pattern: /leverage/gi, replacements: ['use', 'utilize', 'take advantage of', 'employ'], category: 'verb' },
        { pattern: /seamless/gi, replacements: ['smooth', 'easy', 'effortless', 'simple'], category: 'adjective' },
        { pattern: /robust/gi, replacements: ['strong', 'reliable', 'solid', 'powerful'], category: 'adjective' },
        { pattern: /delve into/gi, replacements: ['explore', 'look at', 'examine', 'dive into'], category: 'verb' },
        { pattern: /myriad of/gi, replacements: ['many', 'lots of', 'numerous', 'countless'], category: 'quantifier' },
        { pattern: /plethora of/gi, replacements: ['lots of', 'many', 'tons of', 'plenty of'], category: 'quantifier' },

        // Overly formal transitions
        { pattern: /However,/gi, replacements: ['But,', 'Though,', 'Still,', 'Yet,'], category: 'transition' },
        { pattern: /Therefore,/gi, replacements: ['So,', 'That\'s why', 'Because of this,', 'This means'], category: 'conclusion' },
        { pattern: /Subsequently,/gi, replacements: ['Then,', 'After that,', 'Next,', 'Later,'], category: 'sequence' },
        { pattern: /Consequently,/gi, replacements: ['As a result,', 'So,', 'This means', 'Because of this,'], category: 'consequence' },
        { pattern: /Nevertheless,/gi, replacements: ['Still,', 'Even so,', 'But,', 'Yet,'], category: 'contrast' },

        // Generic superlatives
        { pattern: /incredibly/gi, replacements: ['really', 'very', 'extremely', 'quite'], category: 'intensifier' },
        { pattern: /tremendously/gi, replacements: ['greatly', 'significantly', 'a lot', 'substantially'], category: 'intensifier' },
        { pattern: /exceptionally/gi, replacements: ['very', 'really', 'particularly', 'especially'], category: 'intensifier' },
        { pattern: /extraordinarily/gi, replacements: ['really', 'very', 'incredibly', 'amazingly'], category: 'intensifier' },

        // AI-specific structures
        { pattern: /It is worth noting that/gi, replacements: ['Worth mentioning', 'Interesting to note', 'Also', 'Plus'], category: 'emphasis' },
        { pattern: /One must consider/gi, replacements: ['You should think about', 'Consider', 'Think about', 'Remember'], category: 'consideration' },
        { pattern: /It can be observed that/gi, replacements: ['You can see that', 'Notice that', 'It\'s clear that', 'Obviously'], category: 'observation' },
    ];

    const [humanizationMode, setHumanizationMode] = useState('balanced');

    const humanizationModes = {
        conservative: { intensity: 0.3, casualness: 0.2, variety: 0.4 },
        balanced: { intensity: 0.6, casualness: 0.5, variety: 0.7 },
        aggressive: { intensity: 0.9, casualness: 0.8, variety: 0.9 }
    };

    const [batchMode, setBatchMode] = useState(false);
const [batchTexts, setBatchTexts] = useState(['']);

const handleBatchProcess = async () => {
  const results = [];
  for (let i = 0; i < batchTexts.length; i++) {
    if (batchTexts[i].trim()) {
      const result = await humanizeText(batchTexts[i]);
      results.push(result);
    }
  }
  setBatchResults(results);
};


    // Function to add sentence variety and natural flow
    const varysentences = (text) => {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

        return sentences.map((sentence, index) => {
            sentence = sentence.trim();
            if (!sentence) return sentence;

            // Occasionally combine short sentences
            if (Math.random() < 0.2 && sentence.length < 50 && index < sentences.length - 1) {
                const conjunctions = [' and ', ' but ', ' so ', ' yet ', ' plus '];
                const randomConj = conjunctions[Math.floor(Math.random() * conjunctions.length)];
                return sentence + randomConj + sentences[index + 1].trim().toLowerCase();
            }

            // Add variety to sentence starters
            if (Math.random() < 0.15 && index > 0) {
                const starters = ['Actually, ', 'You know, ', 'Honestly, ', 'Frankly, ', 'Really, ', 'Look, '];
                const randomStarter = starters[Math.floor(Math.random() * starters.length)];
                return randomStarter + sentence.charAt(0).toLowerCase() + sentence.slice(1);
            }

            // Occasionally add emphasis
            if (Math.random() < 0.1) {
                const emphasis = [' (which is pretty cool)', ' (if you ask me)', ' (obviously)', ' (clearly)'];
                const randomEmphasis = emphasis[Math.floor(Math.random() * emphasis.length)];
                return sentence + randomEmphasis;
            }

            return sentence;
        }).join('. ');
    };

    // Function to add contractions for natural speech
    const addContractions = (text) => {
        const contractions = [
            { pattern: /\bdo not\b/gi, replacement: "don't" },
            { pattern: /\bdoes not\b/gi, replacement: "doesn't" },
            { pattern: /\bdid not\b/gi, replacement: "didn't" },
            { pattern: /\bwill not\b/gi, replacement: "won't" },
            { pattern: /\bwould not\b/gi, replacement: "wouldn't" },
            { pattern: /\bshould not\b/gi, replacement: "shouldn't" },
            { pattern: /\bcould not\b/gi, replacement: "couldn't" },
            { pattern: /\bcannot\b/gi, replacement: "can't" },
            { pattern: /\bis not\b/gi, replacement: "isn't" },
            { pattern: /\bare not\b/gi, replacement: "aren't" },
            { pattern: /\bwas not\b/gi, replacement: "wasn't" },
            { pattern: /\bwere not\b/gi, replacement: "weren't" },
            { pattern: /\bhave not\b/gi, replacement: "haven't" },
            { pattern: /\bhas not\b/gi, replacement: "hasn't" },
            { pattern: /\bhad not\b/gi, replacement: "hadn't" },
            { pattern: /\bI am\b/g, replacement: "I'm" },
            { pattern: /\byou are\b/gi, replacement: "you're" },
            { pattern: /\bwe are\b/gi, replacement: "we're" },
            { pattern: /\bthey are\b/gi, replacement: "they're" },
            { pattern: /\bit is\b/gi, replacement: "it's" },
            { pattern: /\bthat is\b/gi, replacement: "that's" },
            { pattern: /\bwho is\b/gi, replacement: "who's" },
            { pattern: /\bwhere is\b/gi, replacement: "where's" },
        ];

        let result = text;
        contractions.forEach(({ pattern, replacement }) => {
            if (Math.random() < 0.75) { // 75% chance to apply contraction
                result = result.replace(pattern, replacement);
            }
        });

        return result;
    };

    // Function to add casual expressions and filler words
    const addCasualExpressions = (text) => {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

        return sentences.map(sentence => {
            sentence = sentence.trim();

            // Add casual expressions at the beginning
            if (Math.random() < 0.2) {
                const expressions = [
                    'you know, ',
                    'I mean, ',
                    'basically, ',
                    'look, ',
                    'listen, ',
                    'well, ',
                ];
                const randomExpr = expressions[Math.floor(Math.random() * expressions.length)];
                sentence = randomExpr + sentence.charAt(0).toLowerCase() + sentence.slice(1);
            }

            // Add casual modifiers
            if (Math.random() < 0.15) {
                sentence = sentence.replace(/\bvery\b/gi, () => {
                    const replacements = ['pretty', 'really', 'quite', 'super'];
                    return replacements[Math.floor(Math.random() * replacements.length)];
                });
            }

            return sentence;
        }).join('. ');
    };

    // Function to fix passive voice
    const reducePassiveVoice = (text) => {
        const passivePatterns = [
            { pattern: /is being (\w+ed)/gi, replacement: (match, verb) => `gets ${verb}` },
            { pattern: /was (\w+ed) by/gi, replacement: (match, verb) => `got ${verb} by` },
            { pattern: /will be (\w+ed)/gi, replacement: (match, verb) => `will get ${verb}` },
            { pattern: /has been (\w+ed)/gi, replacement: (match, verb) => `got ${verb}` },
            { pattern: /are (\w+ed) by/gi, replacement: (match, verb) => `get ${verb} by` },
        ];

        let result = text;
        passivePatterns.forEach(({ pattern, replacement }) => {
            if (Math.random() < 0.6) { // 60% chance to modify passive voice
                result = result.replace(pattern, replacement);
            }
        });

        return result;
    };

    // Main humanization function with processing steps
    const humanizeText = useCallback(async (text) => {
        if (!text.trim()) return '';

        setIsProcessing(true);
        let humanizedText = text;

        // Step 1: Replace AI-specific patterns
        setProcessingStep('Replacing AI patterns...');
        await new Promise(resolve => setTimeout(resolve, 300));

        aiPatterns.forEach(({ pattern, replacements }) => {
            humanizedText = humanizedText.replace(pattern, () => {
                return replacements[Math.floor(Math.random() * replacements.length)];
            });
        });

        // Step 2: Add contractions
        setProcessingStep('Adding natural contractions...');
        await new Promise(resolve => setTimeout(resolve, 300));
        humanizedText = addContractions(humanizedText);

        // Step 3: Reduce passive voice
        setProcessingStep('Improving sentence structure...');
        await new Promise(resolve => setTimeout(resolve, 300));
        humanizedText = reducePassiveVoice(humanizedText);

        // Step 4: Vary sentence structure
        setProcessingStep('Adding variety...');
        await new Promise(resolve => setTimeout(resolve, 300));
        humanizedText = varysentences(humanizedText);

        // Step 5: Add casual expressions
        setProcessingStep('Making it more conversational...');
        await new Promise(resolve => setTimeout(resolve, 300));
        humanizedText = addCasualExpressions(humanizedText);

        // Step 6: Final cleanup
        setProcessingStep('Final polish...');
        await new Promise(resolve => setTimeout(resolve, 200));

        humanizedText = humanizedText
            .replace(/\s+/g, ' ') // Remove extra spaces
            .replace(/\.\s*\./g, '.') // Fix double periods
            .replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => punct + ' ' + letter.toUpperCase()) // Capitalize after punctuation
            .replace(/\s+([,.!?])/g, '$1') // Fix spacing before punctuation
            .trim();

        setProcessingStep('');
        setIsProcessing(false);
        return humanizedText;
    }, []);

    const handleHumanize = async () => {
        if (!inputText.trim()) {
            alert('Please enter some text to humanize');
            return;
        }

        const result = await humanizeText(inputText);
        setOutputText(result);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleClear = () => {
        setInputText('');
        setOutputText('');
        setProcessingStep('');
    };

    const handleSampleText = () => {
        const sampleText = `In conclusion, it is important to note that artificial intelligence has tremendously revolutionized the way we approach problem-solving in today's digital age. Furthermore, the cutting-edge algorithms leverage state-of-the-art machine learning techniques to seamlessly process vast amounts of data. Moreover, it should be noted that these robust systems can delve into complex patterns and provide exceptionally accurate results. However, one must consider that the implementation of such technologies requires careful consideration of various factors.`;
        setInputText(sampleText);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                            <Zap className="w-8 h-8" />
                            AI Text Humanizer
                        </h1>
                        <p className="text-blue-100 text-lg">Transform AI-generated content into natural, human-like text</p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        <div className="text-center">
                            <Shield className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="font-semibold">100% Free</h3>
                            <p className="text-sm text-blue-100">No limits, no signups required</p>
                        </div>
                        <div className="text-center">
                            <Users className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="font-semibold">Human-like</h3>
                            <p className="text-sm text-blue-100">Natural conversational tone</p>
                        </div>
                        <div className="text-center">
                            <Zap className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="font-semibold">Instant</h3>
                            <p className="text-sm text-blue-100">Real-time processing</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-700">AI Generated Text</h3>
                                </div>
                                <button
                                    onClick={handleSampleText}
                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                    Try Sample Text
                                </button>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste your AI-generated text here..."
                                className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Characters: {inputText.length}</span>
                                <span>Words: {inputText.split(/\s+/).filter(word => word.length > 0).length}</span>
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-700">Humanized Text</h3>
                                </div>
                                {outputText && (
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                        <span className="text-sm">{copySuccess ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                )}
                            </div>
                            <textarea
                                value={outputText}
                                readOnly
                                placeholder="Humanized text will appear here..."
                                className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg resize-none bg-gray-50"
                            />
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Characters: {outputText.length}</span>
                                <span>Words: {outputText.split(/\s+/).filter(word => word.length > 0).length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Processing Status */}
                    {isProcessing && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                                <span className="text-blue-700 font-medium">{processingStep}</span>
                            </div>
                            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={handleHumanize}
                            disabled={isProcessing || !inputText.trim()}
                            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                        >
                            <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                            <span>{isProcessing ? 'Humanizing...' : 'Humanize Text'}</span>
                        </button>

                        <button
                            onClick={handleClear}
                            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-blue-600" />
                                How it works:
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Replaces formal AI phrases with casual alternatives</li>
                                <li>• Adds contractions to make text sound more natural</li>
                                <li>• Varies sentence structure and length</li>
                                <li>• Introduces casual expressions and human-like patterns</li>
                                <li>• Removes robotic transition words</li>
                                <li>• Reduces passive voice for better flow</li>
                            </ul>
                        </div>

                        <div className="p-6 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-600" />
                                Best Practices:
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Review the output and make manual adjustments</li>
                                <li>• Add personal experiences and examples</li>
                                <li>• Include specific details and anecdotes</li>
                                <li>• Vary paragraph lengths for natural flow</li>
                                <li>• Use industry-specific terminology appropriately</li>
                                <li>• Always fact-check the humanized content</li>
                            </ul>
                        </div>
                    </div>

                    {/* Stats Section */}
                    {outputText && (
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">{Math.round((outputText.length / inputText.length) * 100)}%</div>
                                <div className="text-sm text-gray-600">Length Retention</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-600">{(outputText.match(/'/g) || []).length}</div>
                                <div className="text-sm text-gray-600">Contractions Added</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-purple-600">{outputText.split(/[.!?]+/).length - 1}</div>
                                <div className="text-sm text-gray-600">Sentences</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {Math.round(outputText.split(/[.!?]+/).reduce((acc, sentence) => acc + sentence.trim().split(/\s+/).length, 0) / (outputText.split(/[.!?]+/).length - 1)) || 0}
                                </div>
                                <div className="text-sm text-gray-600">Avg Words/Sentence</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AITextHumanizer;