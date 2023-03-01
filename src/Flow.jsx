/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { addEdge, Controls, Background } from 'react-flow-renderer';
import axios from 'axios';
import 'react-flow-renderer/dist/style.css';

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const nodesToRender = [];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/schemas');
        const schemaData = response.data.schemas;
        console.log('schemaData:', schemaData);
        // const nodeData = [];
        schemaData.forEach((schema, index) => {
          if (!nodesToRender.find((node) => node.id === schema.table)) {
            nodesToRender.push({
              id: schema.table,
              data: { label: schema.table },
              position: { x: 100 + index, y: 100 + index },
            });
          }
        });
        console.log('nodesToRender:', nodesToRender);
        // const edgeData = schemaData.map((schema) => {
        //   const targetNode = nodesToRender.find((node) => node.id === schema.foreign_table_name);
        //   return {
        //     id: `${schema.table}-${schema.foreign_table_name}-${schema.foreign_column_name}`,
        //     source: schema.table,
        //     target: targetNode ? targetNode.id : null,
        //   };
        // });
        // console.log('edgeData:', edgeData);
        setNodes(nodesToRender);
        // setEdges(edgeData);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const testNodes = [{ id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } }];

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div className="diagram">
      <ReactFlow
        nodes={testNodes}
        elements={nodes.concat(edges)}
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
