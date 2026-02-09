'use client';

import { useCallback, useState, useMemo, useEffect } from 'react';
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
  const [gameDoc, setGameDoc] = useState('');
  const [runQueue, setRunQueue] = useState([]);
  const [runIndex, setRunIndex] = useState(-1);
  const [runToken, setRunToken] = useState(0);
  const [runningNodeId, setRunningNodeId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState('');
  const [completedNodeIds, setCompletedNodeIds] = useState(() => new Set());

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
          gameDoc,
          onGameDocGenerated: setGameDoc,
          runToken,
          runNodeId: runningNodeId,
          onNodeDone: null,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, handleTextChange, gameDoc, runToken, runningNodeId]
  );

  const getTypePriority = useCallback((type) => {
    const priorityMap = {
      textPrompt: 0,
      story: 1,
      characterDesign: 2,
      levelDesign: 3,
    };
    return priorityMap[type] ?? 10;
  }, []);

  const buildRunOrder = useCallback(() => {
    const connectedIds = new Set();
    edges.forEach((edge) => {
      connectedIds.add(edge.source);
      connectedIds.add(edge.target);
    });

    const nodesInFlow = nodes.filter((node) => connectedIds.has(node.id));
    if (nodesInFlow.length === 0) {
      return [];
    }

    const nodeById = new Map(nodesInFlow.map((node) => [node.id, node]));
    const inDegree = new Map();
    const adj = new Map();

    nodesInFlow.forEach((node) => {
      inDegree.set(node.id, 0);
      adj.set(node.id, []);
    });

    edges.forEach((edge) => {
      if (!nodeById.has(edge.source) || !nodeById.has(edge.target)) return;
      adj.get(edge.source).push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    const queue = nodesInFlow
      .filter((node) => inDegree.get(node.id) === 0)
      .sort((a, b) => getTypePriority(a.type) - getTypePriority(b.type));

    const order = [];
    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current.id);
      const neighbors = adj.get(current.id) || [];
      neighbors.forEach((neighborId) => {
        inDegree.set(neighborId, inDegree.get(neighborId) - 1);
        if (inDegree.get(neighborId) === 0) {
          queue.push(nodeById.get(neighborId));
          queue.sort((a, b) => getTypePriority(a.type) - getTypePriority(b.type));
        }
      });
    }

    return order;
  }, [edges, nodes, getTypePriority]);

  const handleRunAll = useCallback(() => {
    const order = buildRunOrder();
    if (order.length === 0) {
      setRunError('Connect nodes before running the flow.');
      return;
    }

    setRunError('');
    setCompletedNodeIds(new Set());
    setRunQueue(order);
    setRunIndex(0);
    setIsRunning(true);
    setRunningNodeId(order[0]);
    setRunToken((prev) => prev + 1);
  }, [buildRunOrder]);

  const handleNodeDone = useCallback(
    (nodeId) => {
      if (!isRunning || nodeId !== runningNodeId) return;

      setCompletedNodeIds((prev) => {
        const next = new Set(prev);
        next.add(nodeId);
        return next;
      });

      const nextIndex = runIndex + 1;
      if (nextIndex >= runQueue.length) {
        setIsRunning(false);
        setRunningNodeId(null);
        setRunIndex(-1);
        return;
      }

      setRunIndex(nextIndex);
      setRunningNodeId(runQueue[nextIndex]);
      setRunToken((prev) => prev + 1);
    },
    [isRunning, runningNodeId, runIndex, runQueue]
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          gameDoc,
          onGameDocGenerated: setGameDoc,
          runToken,
          runNodeId: runningNodeId,
          onNodeDone: handleNodeDone,
          runStatus:
            node.id === runningNodeId
              ? 'running'
              : completedNodeIds.has(node.id)
                ? 'done'
                : 'idle',
        },
      }))
    );
  }, [gameDoc, runToken, runningNodeId, completedNodeIds, handleNodeDone, setNodes]);

  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const sourceIsRunning = edge.source === runningNodeId;
      const sourceIsDone = completedNodeIds.has(edge.source);
      const animated = sourceIsRunning;

      let style = {
        stroke: 'rgba(148, 163, 184, 0.45)',
        strokeWidth: 1.5,
      };

      if (sourceIsRunning) {
        style = {
          stroke: '#22d3ee',
          strokeWidth: 2.5,
        };
      } else if (sourceIsDone) {
        style = {
          stroke: '#34d399',
          strokeWidth: 2,
        };
      }

      return {
        ...edge,
        animated,
        style,
      };
    });
  }, [edges, runningNodeId, completedNodeIds]);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Toolbar */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 text-white p-5 flex gap-3 items-center shadow-2xl">
        <h1 className="text-xl font-bold mr-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Project Canvas</h1>
        <button
          onClick={handleRunAll}
          disabled={isRunning}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg ${isRunning ? 'bg-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 shadow-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/60 hover:scale-105 active:scale-95'}`}
        >
          {isRunning ? 'Running...' : 'Run Flow'}
        </button>
        {runError && (
          <div className="text-sm text-red-300 ml-2">{runError}</div>
        )}
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
          edges={styledEdges}
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
