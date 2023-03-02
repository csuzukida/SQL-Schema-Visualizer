/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  Handle,
  Position,
  ReactFlowProvider,
} from 'reactflow';
import axios from 'axios';
import 'react-flow-renderer/dist/style.css';

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/schemas');
        const schemaData = response.data.schemas;
        const nodeData = [];
        schemaData.forEach((schema, index) => {
          const parentNode = {
            id: schema.table_name,
            data: { label: schema.table_name },
            position: {
              x: 100 + index * Math.floor(Math.random() * 80),
              y: 100 + index * Math.floor(Math.random() * 50),
            },
          };
          nodeData.push(parentNode);
          if (schema.foreign_table_name) {
            const childNode = {
              id: `${schema.table_name}-${schema.references}`,
              data: {
                label: schema.foreign_column_name,
                parent: schema.table_name,
              },
              position: {
                x: parentNode.position.x + 100,
                y: parentNode.position.y,
              },
            };
            parentNode.data.children = [childNode.id];
            nodeData.push(childNode);
          }
        });
        const edgeData = schemaData.map((schema) => ({
          id: `${schema.table_name}-${schema.references}-${schema.foreign_column_name}`,
          source: schema.table_name,
          target: `${schema.table_name}-${schema.references}-${schema.foreign_column_name}`,
          animated: true,
          label: schema.references,
        }));
        setNodes(nodeData);
        setEdges(edgeData);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="diagram">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
