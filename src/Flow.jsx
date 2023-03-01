/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
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
          if (!nodeData.find((node) => node.id === schema.table_name)) {
            nodeData.push({
              id: schema.table_name,
              data: { label: schema.table_name },
              position: {
                x: 100 + index * Math.floor(Math.random() * 80),
                y: 100 + index * Math.floor(Math.random() * 50),
              },
            });
          }
        });
        console.log('NODE_DATA: ', nodeData);
        //   const edgeData = schemaData.map((table) => {
        //     const targetNode = nodeData.find((node) => node.table_name === table.foreign_table_name);
        //     return {
        //       id: `${table.table_name}-${table.references}-${table.foreign_column_name}`,
        //       source: table.table,
        //       target: table.referenced_key_name,
        //     };
        //   });
        setNodes(nodeData);
        //   setEdges(edgeData);
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
