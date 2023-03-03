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
import Buttons from './Buttons';
import 'react-flow-renderer/dist/style.css';

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

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

  const handleAddForeignKey = (foreignKeyName) => {
    const selectedParentNode = selectedNode.id;
    console.log('selectedParentNode', selectedParentNode);
    const newForeignKeyNode = {
      id: foreignKeyName + 2,
      type: 'input',
      data: { label: `${foreignKeyName}` },
      position: { x: 25, y: 45 },
      parentNode: selectedParentNode,
      style: {
        background: '#c89666',
        color: '#12343b',
      },
      zIndex: 10,
      sourcePosition: 'right',
      extent: 'parent',
    };
    setNodes([...nodes, newForeignKeyNode]);
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddForeignKey(nodeName);
  };

  const handleDoubleClick = (event, node) => {
    console.log('double click');
    event.preventDefault();
    if (node.type === 'group') {
      setSelectedNode(node);
      setShowModal(true);
    }
  };

  const handleAddNode = (nodeName) => {
    const colWidth = 300;
    const rowHeight = 250;

    const lastNode = nodes[nodes.length - 1];
    const lastNodeX = lastNode.position.x;
    const lastNodeY = lastNode.position.y;

    const newNodeX = lastNodeX + colWidth;
    const newNodeY = lastNodeY + rowHeight;

    const newGroupNode = {
      id: nodeName,
      type: 'group',
      position: {
        x: newNodeX + Math.floor(Math.random() * 10),
        y: newNodeY + Math.floor(Math.random() * 10),
      },
      style: {
        background: '#2d545e',
        border: '1px solid #E2BAB1',
        padding: 10,
        borderRadius: 5,
        width: 200,
        height: 150,
      },
    };

    const newTableNode = {
      id: nodeName + 1,
      type: 'output',
      data: {
        label: `Table ${nodeName}`,
      },
      position: { x: 25, y: 10 },
      parentNode: nodeName,
      extent: 'parent',
      style: {
        background: '#c89666',
        color: '#12343b',
        fontWeight: 'bold',
      },
      targetPosition: 'left',
    };

    setNodes([newGroupNode, newTableNode, ...nodes]);
  };

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
          });
        });

        // Generate the table nodes as children of the group nodes
        schemaData.forEach((schema) => {
          if (!allNodes.includes(schema.table_name)) {
            allNodes.push({
              id: schema.table_name + 1,
              type: 'output',
              data: {
                label: `Table ${schema.table_name}`,
              },
              position: { x: 25, y: 10 },
              parentNode: schema.table_name,
              extent: 'parent',
              style: {
                background: '#c89666',
                color: '#12343b',
                fontWeight: 'bold',
              },
              targetPosition: 'left',
            });
          }
        });

        // Generate the foreign key nodes as children of the table nodes
        schemaData.forEach((schema) => {
          if (schema.foreign_key) {
            allNodes.push({
              id: schema.table_name + 2,
              type: 'input',
              data: { label: `${schema.foreign_key}` },
              position: { x: 25, y: 60 },
              parentNode: schema.table_name,
              style: {
                background: '#c89666',
                color: '#12343b',
              },
              sourcePosition: 'right',
              extent: 'parent',
            });
          }
        });
        setNodes(allNodes);

        // Generate the edges
        const allEdges = [];

        schemaData.forEach((schema) => {
          if (schema.references) {
            const edge = {
              id: `${schema.table_name}-${schema.references}`,
              source: schema.table_name + 2,
              target: schema.references + 1,
              animated: true,
              zIndex: 10,
              interactionWidth: 50,
            };

            allEdges.push(edge);
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
      <Buttons onAddNode={handleAddNode} />
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        snapToGrid
        snapGrid={[5, 5]}
        onNodeDoubleClick={handleDoubleClick}
      >
        <Background />
        <Controls />
      </ReactFlow>
      {showModal && (
        <div className="modal">
          <form className="modal-form" onSubmit={handleSubmit}>
            <label>
              Foreign Key Name:
              <input type="text" value={nodeName} onChange={(e) => setNodeName(e.target.value)} />
            </label>
            <button type="submit">Add Foreign Key</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Flow;
