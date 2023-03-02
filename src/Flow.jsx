/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  Edge,
} from 'react-flow-renderer';
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

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, sourceHandle: null, targetHandle: 'target' }, eds)),
    [],
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/schemas');
        const schemaData = response.data.result;
        const allNodes = [];

        // Generate the group nodes
        schemaData.forEach((schema) => {
          allNodes.push({
            id: schema.table_name,
            type: 'group',
            position: { x: Math.floor(Math.random() * 800), y: Math.floor(Math.random() * 800) },
            style: {
              background: '#2d545e',
              border: '1px solid #E2BAB1',
              padding: 10,
              borderRadius: 5,
              width: 200,
              height: 150,
            },
          });
        });

        // Generate the table nodes as children of the group nodes
        schemaData.forEach((schema) => {
          if (!allNodes.includes(schema.table_name)) {
            allNodes.push({
              id: schema.table_name + 1,
              type: 'input',
              data: { label: schema.table_name },
              position: { x: 25, y: 10 },
              parentNode: schema.table_name,
              extent: 'parent',
              style: {
                background: '#c89666',
              },
            });
          }
        });

        // Generate the foreign key nodes as children of the table nodes
        schemaData.forEach((schema) => {
          if (schema.foreign_key) {
            allNodes.push({
              id: schema.table_name + 2,
              type: 'input',
              data: { label: schema.foreign_key },
              position: { x: 0, y: 30 },
              parentNode: schema.table_name + 1,
              style: {
                background: '#c89666',
              },
            });
          }
        });
        setNodes(allNodes);

        // Generate the edges
        const allEdges = [];

        schemaData.forEach((schema) => {
          if (schema.references) {
            allEdges.push({
              id: `${schema.table_name}-${schema.references}`,
              source: schema.table_name + 2,
              target: schema.references + 1,
            });
          }
        });

        setEdges(allEdges);
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
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
