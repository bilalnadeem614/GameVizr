'use client';

import { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  CharacterDesignNode,
  LevelDesignNode,
  StoryNode,
  TextPromptNode,
} from './components/CustomNodes';

const initialNodes = [];
const initialEdges = [];

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

export default function ProjectCanvas({ params }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeTexts, setNodeTexts] = useState({});

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      characterDesign: CharacterDesignNode,
      levelDesign: LevelDesignNode,
      story: StoryNode,
      textPrompt: TextPromptNode,
    }),
    []
  );

  // Handle connection between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle text change in text prompt nodes
  const handleTextChange = useCallback((nodeId, text) => {
    setNodeTexts((prev) => ({
      ...prev,
      [nodeId]: text,
    }));
  }, []);

  // Add a new node of specified type
  const addNode = useCallback(
    (type) => {
      const newNode = {
        id: getId(),
        type,
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        data: {
          label: `${type} node`,
          ...(type === 'textPrompt' && { onChange: handleTextChange }),
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, handleTextChange]
  );

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Toolbar */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 text-white p-5 flex gap-3 items-center shadow-2xl">
        <h1 className="text-xl font-bold mr-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Project Canvas</h1>
        <button
          onClick={() => addNode('characterDesign')}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-105 active:scale-95"
        >
          + Character Design
        </button>
        <button
          onClick={() => addNode('levelDesign')}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 hover:scale-105 active:scale-95"
        >
          + Level Design
        </button>
        <button
          onClick={() => addNode('story')}
          className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/70 hover:scale-105 active:scale-95"
        >
          + Story Block
        </button>
        <button
          onClick={() => addNode('textPrompt')}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/70 hover:scale-105 active:scale-95"
        >
          + Text Prompt
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Controls className="!bg-white/10 !backdrop-blur-xl !border !border-white/20 !shadow-2xl" />
          <MiniMap 
            className="!bg-white/10 !backdrop-blur-xl !border !border-white/20 !shadow-2xl" 
            maskColor="rgba(0, 0, 0, 0.6)"
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1.5}
            color="rgba(148, 163, 184, 0.3)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
