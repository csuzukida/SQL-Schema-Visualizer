/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  addNode,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/schemas');
        const schemaData = response.data.schemas;
        const nodeData = [];
        console.log('SCHEMA_DATA: ', schemaData);
        schemaData.forEach((schema, index) => {
          if (!nodeData.find((node) => node.id === schema.table)) {
            nodeData.push({
              id: schema.table,
              data: { label: schema.table },
              position: {
                x: 100 + index * Math.floor(Math.random() * 80),
                y: 100 + index * Math.floor(Math.random() * 50),
              },
            });
          }
        });
        console.log('NODE_DATA: ', nodeData);
        const edgeData = schemaData.map((schema) => {
          // console.log('nodeData: ', nodeData);
          const targetNode = nodeData.find((node) => node.table === schema.foreign_table_name);
          console.log('targetNode: ', targetNode);
          return {
            id: `${schema.table}-${schema.foreign_table_name}-${schema.foreign_column_name}`,
            source: schema.table,
            target: targetNode ? targetNode.id : null,
          };
        });
        setNodes(nodeData);
        setEdges(edgeData);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

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
