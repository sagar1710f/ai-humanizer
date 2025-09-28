import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

const FeedbackSystem = ({ originalText, humanizedText, onFeedback }) => {
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState('');

  const handleFeedback = (type) => {
    setFeedback(type);
    onFeedback({
      type,
      comment,
      original: originalText,
      humanized: humanizedText,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600 mb-3">How was the humanization quality?</p>
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => handleFeedback('positive')}
          className={`flex items-center space-x-1 px-3 py-1 rounded ${
            feedback === 'positive' ? 'bg-green-500 text-white' : 'bg-white border'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Good</span>
        </button>
        <button
          onClick={() => handleFeedback('negative')}
          className={`flex items-center space-x-1 px-3 py-1 rounded ${
            feedback === 'negative' ? 'bg-red-500 text-white' : 'bg-white border'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>Needs Work</span>
        </button>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Any specific feedback? (optional)"
        className="w-full p-2 border rounded text-sm"
        rows={2}
      />
    </div>
  );
};

export default FeedbackSystem;