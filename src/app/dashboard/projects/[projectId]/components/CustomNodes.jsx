'use client';

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NodeModal from './NodeModal';

// Character Design Block Node
export const CharacterDesignNode = ({ data, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState({
    characterName: data?.config?.characterName || '',
    style: data?.config?.style || '',
    traits: data?.config?.traits || '',
  });
  const [output, setOutput] = useState(data?.output || '');

  const handleGenerate = () => {
    const generated = `Character Design Generated:\n\nName: ${config.characterName}\nStyle: ${config.style}\nTraits: ${config.traits}\n\n[Generated character artwork would appear here]`;
    setOutput(generated);
  };

  return (
    <>
      <div 
        className="px-5 py-4 shadow-2xl rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/90 to-purple-600/90 backdrop-blur-xl min-w-[220px] transition-all duration-300 hover:shadow-purple-500/50 hover:shadow-3xl hover:scale-105 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-purple-300 transition-all duration-300 group-hover:!bg-purple-200 group-hover:scale-125" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
          <div className="font-bold text-white text-base tracking-wide">Character Design</div>
        </div>
        <div className="text-sm text-purple-100/90 leading-relaxed">
          {config.characterName || 'Click to configure'}
        </div>
        {output && (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/80">
            ✓ Output ready
          </div>
        )}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-300 transition-all duration-300 group-hover:!bg-purple-200 group-hover:scale-125" />
      </div>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeType="characterDesign"
        config={config}
        setConfig={setConfig}
        output={output}
        onGenerate={handleGenerate}
      />
    </>
  );
};

// Level Design Block Node
export const LevelDesignNode = ({ data, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState({
    levelName: data?.config?.levelName || '',
    difficulty: data?.config?.difficulty || '',
    environment: data?.config?.environment || '',
  });
  const [output, setOutput] = useState(data?.output || '');

  const handleGenerate = () => {
    const generated = `Level Design Generated:\n\nLevel: ${config.levelName}\nDifficulty: ${config.difficulty}\nEnvironment: ${config.environment}\n\n[Generated level layout and assets would appear here]`;
    setOutput(generated);
  };

  return (
    <>
      <div 
        className="px-5 py-4 shadow-2xl rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-xl min-w-[220px] transition-all duration-300 hover:shadow-blue-500/50 hover:shadow-3xl hover:scale-105 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-300 transition-all duration-300 group-hover:!bg-blue-200 group-hover:scale-125" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
          <div className="font-bold text-white text-base tracking-wide">Level Design</div>
        </div>
        <div className="text-sm text-blue-100/90 leading-relaxed">
          {config.levelName || 'Click to configure'}
        </div>
        {output && (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/80">
            ✓ Output ready
          </div>
        )}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-blue-300 transition-all duration-300 group-hover:!bg-blue-200 group-hover:scale-125" />
      </div>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeType="levelDesign"
        config={config}
        setConfig={setConfig}
        output={output}
        onGenerate={handleGenerate}
      />
    </>
  );
};

// Story Block Node
export const StoryNode = ({ data, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState({
    storyTitle: data?.config?.storyTitle || '',
    genre: data?.config?.genre || '',
    plot: data?.config?.plot || '',
  });
  const [output, setOutput] = useState(data?.output || '');

  const handleGenerate = () => {
    const generated = `Story Generated:\n\nTitle: ${config.storyTitle}\nGenre: ${config.genre}\nPlot: ${config.plot}\n\n[Generated narrative content would appear here]`;
    setOutput(generated);
  };

  return (
    <>
      <div 
        className="px-5 py-4 shadow-2xl rounded-2xl border border-green-400/30 bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-xl min-w-[220px] transition-all duration-300 hover:shadow-green-500/50 hover:shadow-3xl hover:scale-105 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-green-300 transition-all duration-300 group-hover:!bg-green-200 group-hover:scale-125" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
          <div className="font-bold text-white text-base tracking-wide">Story Block</div>
        </div>
        <div className="text-sm text-green-100/90 leading-relaxed">
          {config.storyTitle || 'Click to configure'}
        </div>
        {output && (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/80">
            ✓ Output ready
          </div>
        )}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-300 transition-all duration-300 group-hover:!bg-green-200 group-hover:scale-125" />
      </div>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeType="story"
        config={config}
        setConfig={setConfig}
        output={output}
        onGenerate={handleGenerate}
      />
    </>
  );
};

// Text Prompt Block Node
export const TextPromptNode = ({ data, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState({
    promptText: data?.config?.promptText || '',
    model: data?.config?.model || '',
    temperature: data?.config?.temperature || '',
  });
  const [output, setOutput] = useState(data?.output || '');

  const handleGenerate = () => {
    const generated = `AI Response Generated:\n\nModel: ${config.model}\nTemperature: ${config.temperature}\n\nPrompt: ${config.promptText}\n\nResponse:\nThis is a sample AI-generated response based on your prompt. In a real implementation, this would be the actual AI model output.`;
    setOutput(generated);
  };

  return (
    <>
      <div 
        className="px-5 py-4 shadow-2xl rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/90 to-amber-600/90 backdrop-blur-xl min-w-[240px] transition-all duration-300 hover:shadow-orange-500/50 hover:shadow-3xl hover:scale-105 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-orange-300 transition-all duration-300 group-hover:!bg-orange-200 group-hover:scale-125" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
          <div className="font-bold text-white text-base tracking-wide">Text Prompt</div>
        </div>
        <div className="text-sm text-orange-100/90 leading-relaxed truncate">
          {config.promptText || 'Click to configure'}
        </div>
        {output && (
          <div className="mt-2 px-2 py-1 bg-white/20 rounded text-xs text-white/80">
            ✓ Output ready
          </div>
        )}
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-orange-300 transition-all duration-300 group-hover:!bg-orange-200 group-hover:scale-125" />
      </div>

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeType="textPrompt"
        config={config}
        setConfig={setConfig}
        output={output}
        onGenerate={handleGenerate}
      />
    </>
  );
};
