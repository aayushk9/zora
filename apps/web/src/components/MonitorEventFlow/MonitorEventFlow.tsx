import ReactFlow, { Background, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { SystemNode } from './SystemNode';

const nodeTypes = { system: SystemNode };

const nodes = [
  {
    id: 'input',
    type: 'system',
    position: { x: 50, y: 150 }, 
    data: {
      title: 'Event Selection',
      meta: 'Input Source',
      description: 'User selects prediction markets to track',
      tag: 'INPUT',
    },
  },
  {
    id: 'monitor',
    type: 'system',
    position: { x: 400, y: 50 }, 
    data: {
      title: 'Signal Monitoring',
      meta: 'Web + Market',
      description: 'Agents scan news, social feeds & on-chain signals',
      tag: 'AGENTS',
    },
  },
  {
    id: 'analysis',
    type: 'system',
    position: { x: 400, y: 280 }, 
    data: {
      title: 'AI Analysis',
      meta: 'Inference Engine',
      description: 'Probabilities and scenario trees updated continuously',
      tag: 'AI',
    },
  },
  {
    id: 'output',
    type: 'system',
    position: { x: 750, y: 150 }, 
    data: {
      title: 'Insights',
      meta: 'Coming soon',
      description: 'Actionable signals and alerts appear here',
      tag: 'OUTPUT',
    },
  },
];

const edges = [
  {
    id: 'e1-2',
    source: 'input',
    target: 'monitor',
    type: 'step', 
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    id: 'e1-3',
    source: 'input',
    target: 'analysis',
    type: 'step',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    id: 'e2-4',
    source: 'monitor',
    target: 'output',
    type: 'step',
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'e3-4',
    source: 'analysis',
    target: 'output',
    type: 'step',
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
];

export function MonitorEventFlow() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        }}
      >
        <Background color="#222" gap={25} size={1} />
      </ReactFlow>
    </div>
  );
}