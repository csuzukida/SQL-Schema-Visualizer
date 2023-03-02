/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  Handle,
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

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/schemas');
        const schemaData = response.data.schemas;
        const nodeData = [];
        console.log('SCHEMA_DATA: ', schemaData);
        schemaData.forEach((schema, index) => {
          const tableNode = {
            id: schema.table_name,
            data: { label: schema.table_name },
            position: {
              x: 100 + index * Math.floor(Math.random() * 80),
              y: 100 + index * Math.floor(Math.random() * 50),
            },
          };

          const foreignKeyNode = {
            id: `${schema.table_name}-${schema.foreign_key}`,
            data: { label: schema.foreign_key },
            position: {
              x: tableNode.position.x,
              y: tableNode.position.y + 200,
            },
          };
          nodeData.push(tableNode, foreignKeyNode);
        });
        console.log('NODE_DATA: ', nodeData);
        const edgeData = schemaData.map((schema) => ({
          id: `${schema.table_name}-${schema.foreign_key}-${schema.references}-${schema.referenced_key_name}`,
          source: `${schema.table_name}-${schema.foreign_key}`,
          target: `${schema.references}-${schema.referenced_key_name}`,
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
