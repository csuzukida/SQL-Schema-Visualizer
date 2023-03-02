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
            id: schema.table_name + 1,
            type: 'group',
            position: { x: Math.floor(Math.random() * 800), y: Math.floor(Math.random() * 800) },
            style: {
              background: '#fff',
              border: '1px solid #000',
              padding: 10,
              borderRadius: 5,
              width: 200,
              height: 200,
            },
          });
        });

        // Generate the table nodes as children of the group nodes
        schemaData.forEach((schema, index) => {
          if (!allNodes.includes(schema.table_name)) {
            allNodes.push({
              id: schema.table_name,
              data: { label: schema.table_name },
              position: { x: 250 + index * 30, y: 250 + index * 30 },
              type: 'input',
              parentNode: schema.table_name + 1,
              extent: 'parent',
            });
          }
        });

        const testNode = {
          id: 'test',
          data: { label: 'test' },
          position: { x: 250, y: 250 },
          type: 'input',
          parentNode: 'people',
          extent: 'parent',
        };

        const testNodes = allNodes.concat(testNode);

        setNodes(testNodes);
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
