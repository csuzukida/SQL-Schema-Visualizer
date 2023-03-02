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
  const [parentNodes, setParentNodes] = useState([]);
  const [childNodes, setChildNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setParentNodes((nds) => applyNodeChanges(changes, nds)),
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
        const schemaData = response.data.result;
        console.log('SCHEMA_DATA', schemaData);

        const parentNodes = [];

        schemaData.forEach((schema) => {
          if (!parentNodes.includes(schema.table_name)) {
            parentNodes.push(schema.table_name);
          }
        });

        const childNodes = [];

        console.log('PARENT_NODES', parentNodes);

        // schemaData.forEach((schema) => {

        // })

        setParentNodes(parentNodes);
        setChildNodes(childNodes);
        // setEdges(edgeData);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="diagram">
      <ReactFlow
        nodes={parentNodes.concat(childNodes)}
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
