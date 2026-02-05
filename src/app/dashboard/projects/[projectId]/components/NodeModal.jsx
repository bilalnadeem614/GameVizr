'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function NodeModal({ isOpen, onClose, nodeType, config, setConfig, output, onGenerate }) {
  const [activeTab, setActiveTab] = useState('config');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const getNodeColor = () => {
    switch (nodeType) {
      case 'characterDesign': return { primary: 'purple', gradient: 'from-purple-500 to-purple-600' };
      case 'levelDesign': return { primary: 'blue', gradient: 'from-blue-500 to-blue-600' };
      case 'story': return { primary: 'green', gradient: 'from-green-500 to-emerald-600' };
      case 'textPrompt': return { primary: 'orange', gradient: 'from-orange-500 to-amber-600' };
      default: return { primary: 'gray', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  const getNodeTitle = () => {
    switch (nodeType) {
      case 'characterDesign': return 'Character Design';
      case 'levelDesign': return 'Level Design';
      case 'story': return 'Story Block';
      case 'textPrompt': return 'Text Prompt';
      default: return 'Node';
    }
  };

  const renderConfigForm = () => {
    switch (nodeType) {
      case 'characterDesign':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Character Name</label>
              <input
                type="text"
                placeholder="Enter character name"
                value={config.characterName || ''}
                onChange={(e) => setConfig({ ...config, characterName: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Art Style</label>
              <input
                type="text"
                placeholder="e.g., Anime, Realistic, Pixel Art"
                value={config.style || ''}
                onChange={(e) => setConfig({ ...config, style: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Character Traits</label>
              <textarea
                placeholder="Describe the character's traits, personality, appearance..."
                value={config.traits || ''}
                onChange={(e) => setConfig({ ...config, traits: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                rows={4}
              />
            </div>
          </div>
        );
      
      case 'levelDesign':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Level Name</label>
              <input
                type="text"
                placeholder="Enter level name"
                value={config.levelName || ''}
                onChange={(e) => setConfig({ ...config, levelName: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Difficulty</label>
              <select
                value={config.difficulty || ''}
                onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              >
                <option value="" className="bg-slate-800">Select difficulty</option>
                <option value="Easy" className="bg-slate-800">Easy</option>
                <option value="Medium" className="bg-slate-800">Medium</option>
                <option value="Hard" className="bg-slate-800">Hard</option>
                <option value="Expert" className="bg-slate-800">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Environment Description</label>
              <textarea
                placeholder="Describe the level environment, obstacles, layout..."
                value={config.environment || ''}
                onChange={(e) => setConfig({ ...config, environment: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                rows={4}
              />
            </div>
          </div>
        );
      
      case 'story':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Story Title</label>
              <input
                type="text"
                placeholder="Enter story title"
                value={config.storyTitle || ''}
                onChange={(e) => setConfig({ ...config, storyTitle: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Genre</label>
              <input
                type="text"
                placeholder="e.g., Fantasy, Sci-Fi, Horror"
                value={config.genre || ''}
                onChange={(e) => setConfig({ ...config, genre: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Plot Summary</label>
              <textarea
                placeholder="Describe the story plot, characters, conflict..."
                value={config.plot || ''}
                onChange={(e) => setConfig({ ...config, plot: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                rows={5}
              />
            </div>
          </div>
        );
      
      case 'textPrompt':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Prompt Text</label>
              <textarea
                placeholder="Enter your prompt text..."
                value={config.promptText || ''}
                onChange={(e) => setConfig({ ...config, promptText: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">AI Model</label>
              <input
                type="text"
                placeholder="e.g., GPT-4, Claude, Gemini"
                value={config.model || ''}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                placeholder="0.7"
                value={config.temperature || ''}
                onChange={(e) => setConfig({ ...config, temperature: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
          </div>
        );
      
      default:
        return <div className="text-white/70">No configuration available</div>;
    }
  };

  const colors = getNodeColor();

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-white/10 w-[700px] max-w-[90vw] max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-4 flex items-center justify-between`}>
          <h2 className="text-xl font-bold text-white">{getNodeTitle()}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-slate-800/50">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'config'
                ? `text-white border-b-2 border-${colors.primary}-500 bg-white/5`
                : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`flex-1 px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'output'
                ? `text-white border-b-2 border-${colors.primary}-500 bg-white/5`
                : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            Output
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'config' ? (
            <div>
              {renderConfigForm()}
            </div>
          ) : (
            <div>
              {output ? (
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white/90 whitespace-pre-wrap">
                  {output}
                </div>
              ) : (
                <div className="text-center py-12 text-white/50">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No output yet</p>
                  <p className="text-sm mt-2">Click "Generate" to see the output</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 bg-slate-800/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all duration-300"
          >
            Close
          </button>
          <button
            onClick={() => {
              onGenerate();
              setActiveTab('output');
            }}
            className={`px-6 py-2.5 bg-gradient-to-r ${colors.gradient} hover:shadow-lg hover:shadow-${colors.primary}-500/50 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95`}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
