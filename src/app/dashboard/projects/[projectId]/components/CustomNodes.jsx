'use client';

import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeModal from './NodeModal';

const postJson = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }

  return response.json();
};

// Character Design Block Node
export const CharacterDesignNode = ({ data, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const lastRunToken = useRef(null);
  const runStatus = data?.runStatus || 'idle';
  const isRunning = runStatus === 'running';
  const isDone = runStatus === 'done';
  const [config, setConfig] = useState({
    characterName: data?.config?.characterName || '',
    style: data?.config?.style || '',
    traits: data?.config?.traits || '',
  });
  const [output, setOutput] = useState(data?.output || '');

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError('');

      const gameDoc = data?.gameDoc ? `Game Doc:\n${data.gameDoc}\n\n` : '';
      const imagePrompt = `${gameDoc}Create character concept art.\nName: ${config.characterName}\nStyle: ${config.style}\nTraits: ${config.traits}`;

      const imageResult = await postJson('/api/gemini/image', {
        prompt: imagePrompt,
      });

      const imageUrl = imageResult?.imageUrl || '';
      let reviewText = '';

      if (imageUrl) {
        const reviewPrompt = `${gameDoc}Review if this character matches the game direction. Reply with PASS or FAIL and one sentence.\nName: ${config.characterName}\nStyle: ${config.style}\nTraits: ${config.traits}`;
        const visionResult = await postJson('/api/gemini/vision', {
          prompt: reviewPrompt,
          imageUrl,
        });
        reviewText = visionResult?.text || '';
      }

      const summary = `Image URL: ${imageUrl}\n\nReview: ${reviewText}`;
      setOutput({ text: summary, imageUrl, reviewText });
    } catch (err) {
      setError(err.message || 'Failed to generate character');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!data?.runNodeId || data.runNodeId !== id) return;
    if (data.runToken === lastRunToken.current) return;
    lastRunToken.current = data.runToken;

    (async () => {
      await handleGenerate();
      data?.onNodeDone?.(id);
    })();
  }, [data?.runNodeId, data?.runToken]);

  return (
    <>
      <div 
        className={`px-5 py-4 shadow-2xl rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/90 to-purple-600/90 backdrop-blur-xl min-w-[220px] transition-all duration-300 hover:shadow-purple-500/50 hover:shadow-3xl hover:scale-105 group cursor-pointer ${isRunning ? 'ring-2 ring-cyan-300/80 shadow-cyan-500/40' : ''} ${isDone ? 'ring-2 ring-emerald-300/80 shadow-emerald-500/30' : ''}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-purple-300 transition-all duration-300 group-hover:!bg-purple-200 group-hover:scale-125" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-3 h-3 rounded-full shadow-lg ${isRunning ? 'bg-cyan-200 shadow-cyan-300/50 animate-pulse' : isDone ? 'bg-emerald-300 shadow-emerald-300/50' : 'bg-slate-200 shadow-white/40'}`}></div>
          <div className="font-bold text-white text-base tracking-wide">Character Design</div>
          <div className={`ml-auto text-xs font-semibold ${isRunning ? 'text-cyan-100' : isDone ? 'text-emerald-100' : 'text-white/70'}`}>
            {isRunning ? 'Running' : isDone ? 'Done' : 'Idle'}
          </div>
        </div>
        <div className="text-sm text-purple-100/90 leading-relaxed">
          {config.characterName || 'Click to configure'}
        </div>
        {isRunning ? (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/90 animate-pulse">
            Generating...
          </div>
        ) : output ? (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/80">
            ✓ Output ready
          </div>
        ) : null}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-300 transition-all duration-300 group-hover:!bg-purple-200 group-hover:scale-125" />
      </div>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeType="characterDesign"
        config={config}
        setConfig={setConfig}
        output={output}
        error={error}
      />
    </>
  );
};

// Level Design Block Node
export const LevelDesignNode = ({ data, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const lastRunToken = useRef(null);
  const runStatus = data?.runStatus || 'idle';
  const isRunning = runStatus === 'running';
  const isDone = runStatus === 'done';
  const [config, setConfig] = useState({
    levelName: data?.config?.levelName || '',
    difficulty: data?.config?.difficulty || '',
    environment: data?.config?.environment || '',
  });
  const [output, setOutput] = useState(data?.output || '');

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError('');

      const gameDoc = data?.gameDoc ? `Game Doc:\n${data.gameDoc}\n\n` : '';
      const imagePrompt = `${gameDoc}Create level concept art.\nLevel: ${config.levelName}\nDifficulty: ${config.difficulty}\nEnvironment: ${config.environment}`;

      const imageResult = await postJson('/api/gemini/image', {
        prompt: imagePrompt,
      });

      const imageUrl = imageResult?.imageUrl || '';
      let reviewText = '';

      if (imageUrl) {
        const reviewPrompt = `${gameDoc}Review if this level design matches the game direction. Reply with PASS or FAIL and one sentence.\nLevel: ${config.levelName}\nDifficulty: ${config.difficulty}\nEnvironment: ${config.environment}`;
        const visionResult = await postJson('/api/gemini/vision', {
          prompt: reviewPrompt,
          imageUrl,
        });
        reviewText = visionResult?.text || '';
      }

      const summary = `Image URL: ${imageUrl}\n\nReview: ${reviewText}`;
      setOutput({ text: summary, imageUrl, reviewText });
    } catch (err) {
      setError(err.message || 'Failed to generate level');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!data?.runNodeId || data.runNodeId !== id) return;
    if (data.runToken === lastRunToken.current) return;
    lastRunToken.current = data.runToken;

    (async () => {
      await handleGenerate();
      data?.onNodeDone?.(id);
    })();
  }, [data?.runNodeId, data?.runToken]);

  return (
    <>
      <div 
        className={`px-5 py-4 shadow-2xl rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-xl min-w-[220px] transition-all duration-300 hover:shadow-blue-500/50 hover:shadow-3xl hover:scale-105 group cursor-pointer ${isRunning ? 'ring-2 ring-cyan-300/80 shadow-cyan-500/40' : ''} ${isDone ? 'ring-2 ring-emerald-300/80 shadow-emerald-500/30' : ''}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-300 transition-all duration-300 group-hover:!bg-blue-200 group-hover:scale-125" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-3 h-3 rounded-full shadow-lg ${isRunning ? 'bg-cyan-200 shadow-cyan-300/50 animate-pulse' : isDone ? 'bg-emerald-300 shadow-emerald-300/50' : 'bg-slate-200 shadow-white/40'}`}></div>
          <div className="font-bold text-white text-base tracking-wide">Level Design</div>
          <div className={`ml-auto text-xs font-semibold ${isRunning ? 'text-cyan-100' : isDone ? 'text-emerald-100' : 'text-white/70'}`}>
            {isRunning ? 'Running' : isDone ? 'Done' : 'Idle'}
          </div>
        </div>
        <div className="text-sm text-blue-100/90 leading-relaxed">
          {config.levelName || 'Click to configure'}
        </div>
        {isRunning ? (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/90 animate-pulse">
            Generating...
          </div>
        ) : output ? (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/80">
            ✓ Output ready
          </div>
        ) : null}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-blue-300 transition-all duration-300 group-hover:!bg-blue-200 group-hover:scale-125" />
      </div>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeType="levelDesign"
        config={config}
        setConfig={setConfig}
        output={output}
        error={error}
      />
    </>
  );
};

// Story Block Node
export const StoryNode = ({ data, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const lastRunToken = useRef(null);
  const runStatus = data?.runStatus || 'idle';
  const isRunning = runStatus === 'running';
  const isDone = runStatus === 'done';
  const [config, setConfig] = useState({
    storyTitle: data?.config?.storyTitle || '',
    genre: data?.config?.genre || '',
    plot: data?.config?.plot || '',
  });
  const [output, setOutput] = useState(data?.output || '');

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError('');

      const prompt = `Expand this story into a detailed narrative block.\nTitle: ${config.storyTitle}\nGenre: ${config.genre}\nPlot: ${config.plot}`;
      const result = await postJson('/api/gemini/normal', {
        prompt,
      });

      setOutput(result?.text || '');
    } catch (err) {
      setError(err.message || 'Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!data?.runNodeId || data.runNodeId !== id) return;
    if (data.runToken === lastRunToken.current) return;
    lastRunToken.current = data.runToken;

    (async () => {
      await handleGenerate();
      data?.onNodeDone?.(id);
    })();
  }, [data?.runNodeId, data?.runToken]);

  return (
    <>
      <div 
        className={`px-5 py-4 shadow-2xl rounded-2xl border border-green-400/30 bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-xl min-w-[220px] transition-all duration-300 hover:shadow-green-500/50 hover:shadow-3xl hover:scale-105 group cursor-pointer ${isRunning ? 'ring-2 ring-cyan-300/80 shadow-cyan-500/40' : ''} ${isDone ? 'ring-2 ring-emerald-300/80 shadow-emerald-500/30' : ''}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-green-300 transition-all duration-300 group-hover:!bg-green-200 group-hover:scale-125" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-3 h-3 rounded-full shadow-lg ${isRunning ? 'bg-cyan-200 shadow-cyan-300/50 animate-pulse' : isDone ? 'bg-emerald-300 shadow-emerald-300/50' : 'bg-slate-200 shadow-white/40'}`}></div>
          <div className="font-bold text-white text-base tracking-wide">Story Block</div>
          <div className={`ml-auto text-xs font-semibold ${isRunning ? 'text-cyan-100' : isDone ? 'text-emerald-100' : 'text-white/70'}`}>
            {isRunning ? 'Running' : isDone ? 'Done' : 'Idle'}
          </div>
        </div>
        <div className="text-sm text-green-100/90 leading-relaxed">
          {config.storyTitle || 'Click to configure'}
        </div>
        {isRunning ? (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/90 animate-pulse">
            Generating...
          </div>
        ) : output ? (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/80">
            ✓ Output ready
          </div>
        ) : null}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-300 transition-all duration-300 group-hover:!bg-green-200 group-hover:scale-125" />
      </div>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeType="story"
        config={config}
        setConfig={setConfig}
        output={output}
        error={error}
      />
    </>
  );
};

// Text Prompt Block Node
export const TextPromptNode = ({ data, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const lastRunToken = useRef(null);
  const runStatus = data?.runStatus || 'idle';
  const isRunning = runStatus === 'running';
  const isDone = runStatus === 'done';
  const [config, setConfig] = useState({
    promptText: data?.config?.promptText || '',
    model: data?.config?.model || '',
    temperature: data?.config?.temperature || '',
    useAsGameDoc: data?.config?.useAsGameDoc || false,
  });
  const [output, setOutput] = useState(data?.output || '');

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError('');

      const result = await postJson('/api/gemini/normal', {
        prompt: config.promptText,
        model: config.model || undefined,
      });

      const text = result?.text || '';
      setOutput(text);

      if (config.useAsGameDoc && data?.onGameDocGenerated) {
        data.onGameDocGenerated(text);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate text');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!data?.runNodeId || data.runNodeId !== id) return;
    if (data.runToken === lastRunToken.current) return;
    lastRunToken.current = data.runToken;

    (async () => {
      await handleGenerate();
      data?.onNodeDone?.(id);
    })();
  }, [data?.runNodeId, data?.runToken]);

  return (
    <>
      <div 
        className={`px-5 py-4 shadow-2xl rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/90 to-amber-600/90 backdrop-blur-xl min-w-[240px] transition-all duration-300 hover:shadow-orange-500/50 hover:shadow-3xl hover:scale-105 group cursor-pointer ${isRunning ? 'ring-2 ring-cyan-300/80 shadow-cyan-500/40' : ''} ${isDone ? 'ring-2 ring-emerald-300/80 shadow-emerald-500/30' : ''}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-orange-300 transition-all duration-300 group-hover:!bg-orange-200 group-hover:scale-125" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-3 h-3 rounded-full shadow-lg ${isRunning ? 'bg-cyan-200 shadow-cyan-300/50 animate-pulse' : isDone ? 'bg-emerald-300 shadow-emerald-300/50' : 'bg-slate-200 shadow-white/40'}`}></div>
          <div className="font-bold text-white text-base tracking-wide">Text Prompt</div>
          <div className={`ml-auto text-xs font-semibold ${isRunning ? 'text-cyan-100' : isDone ? 'text-emerald-100' : 'text-white/70'}`}>
            {isRunning ? 'Running' : isDone ? 'Done' : 'Idle'}
          </div>
        </div>
        <div className="text-sm text-orange-100/90 leading-relaxed truncate">
          {'Click to configure'}
        </div>
        {isRunning ? (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/90 animate-pulse">
            Generating...
          </div>
        ) : output ? (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/80">
            ✓ Output ready
          </div>
        ) : null}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-orange-300 transition-all duration-300 group-hover:!bg-orange-200 group-hover:scale-125" />
      </div>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeType="textPrompt"
        config={config}
        setConfig={setConfig}
        output={output}
        error={error}
      />
    </>
  );
};
