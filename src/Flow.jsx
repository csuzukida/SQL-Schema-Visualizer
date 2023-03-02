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

        const numCols = 5;

        const startX = 100;
        const startY = 100;

        const colWidth = 300;
        const rowHeight = 250;

        // Generate the group nodes
        schemaData.forEach((schema, index) => {
          const col = index % numCols;
          const row = Math.floor(index / numCols);

          const xPos = startX + col * colWidth;
          const yPos = startY + row * rowHeight;

          allNodes.push({
            id: schema.table_name,
            type: 'group',
            position: {
              x: xPos + Math.floor(Math.random() * 10),
              y: yPos + Math.floor(Math.random() * 10),
            },
            style: {
              background: '#2d545e',
              border: '1px solid #E2BAB1',
              padding: 10,
              borderRadius: 5,
              width: 200,
              height: 150,
            },
            extent: 'parent',
          });
        });

        // Generate the table nodes as children of the group nodes
        schemaData.forEach((schema) => {
          if (!allNodes.includes(schema.table_name)) {
            allNodes.push({
              id: schema.table_name + 1,
              type: 'output',
              data: { label: schema.table_name },
              position: { x: 25, y: 10 },
              parentNode: schema.table_name,
              extent: 'parent',
              style: {
                background: '#c89666',
                color: '#12343b',
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
              position: { x: 0, y: 40 },
              parentNode: schema.table_name + 1,
              style: {
                background: '#c89666',
                color: '#12343b',
              },
            });
          }
        });
        setNodes(allNodes);

        // Generate the edges
        const allEdges = [];

        schemaData.forEach((schema) => {
          if (schema.references) {
            const node = {
              id: `${schema.table_name}-${schema.references}`,
              source: schema.table_name + 2,
              target: schema.references + 1,
              animated: true,
              zIndex: 10,
            };

            allEdges.push(node);
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
        snapGrid={[5, 5]}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
