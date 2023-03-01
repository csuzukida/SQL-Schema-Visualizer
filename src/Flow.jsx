/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge, addNode, Controls, Background,
} from 'react-flow-renderer';
import axios from 'axios';
import 'react-flow-renderer/dist/style.css';

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

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
              position: { x: 100 + index * 30, y: 100 + index * 40 },
            });
          }
        });
        console.log('NODE_DATA: ', nodeData);
        const edgeData = schemaData.map((schema) => {
          // console.log('nodeData: ', nodeData);
          const targetNode = nodeData.find((node) => node.id === schema.foreign_table_name);
          // console.log('targetNode: ', targetNode);
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

  // const onConnect = useCallback(
  //   (params) => {
  //     console.log('onConnect: ', nodes);
  //     setEdges((eds) => addEdge(params, eds));
  //     const { target } = params;
  //     if (!nodes.find((node) => node.id === target)) {
  //       const newNode = {
  //         id: target,
  //         data: { label: target },
  //         position: { x: 100, y: 100 },
  //       };
  //       setNodes((nodes) => [...nodes, newNode]);
  //     }
  //   },
  //   [nodes],
  // );

  console.log('nodes: ', nodes);
  console.log('edges: ', edges);

  return (
    <div className="diagram">
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
