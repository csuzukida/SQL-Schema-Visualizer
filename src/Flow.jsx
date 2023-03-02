/* eslint-disable import/no-extraneous-dependencies */
import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import axios from 'axios';
import {
  ReactFlow, Background, Controls, Edge, Handle, Position, useStore,
} from '@reactflow/core';
import './styles.css';

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [elements, setElements] = useState([]);
  const store = useStore();

  const onConnect = useCallback((params) => console.log(params), []);

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
              data: { label: `Table ${schema.table_name}`, parent: schema.table_name },
              position: { x: 25, y: 10 },
              snapGrid: { width: 200, height: 150 },
              style: {
                background: '#c89666',
                color: '#12343b',
                fontWeight: 'bold',
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
              data: { label: `${schema.foreign_key}`, parent: schema.table_name },
              position: { x: 25, y: 60 },
              style: {
                background: '#c89666',
                color: '#12343b',
              },
            });
          }
        });

        setElements(allNodes);

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

        setElements((els) => els.concat(allEdges));
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="react-flow-container" ref={reactFlowWrapper}>
      <ReactFlow
        elements={elements}
        onConnect={onConnect}
        onLoad={() => store.fitView()}
        nodeTypes={{
          group: GroupNode,
          input: InputNode,
          output: OutputNode,
        }}
        edgeTypes={{ default: Edge }}
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function GroupNode({ data, children }) {
  const { position, id, style } = data;
  const nodeWidth = style.width;
  const nodeHeight = style.height;

  return (
    <div
      style={{
        ...style,
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id={id}
        className="react-flow__handle-custom"
      />
      <div className="react-flow__group__title">{id}</div>
      <div style={{ position: 'relative', width: nodeWidth, height: nodeHeight }}>{children}</div>
      <Handle
        type="source"
        position={Position.Right}
        id={id}
        className="react-flow__handle-custom"
      />
    </div>
  );
}

function InputNode({ data }) {
  const { label, parent } = data;

  return (
    <div className="react-flow__node-content">
      <div>{label}</div>
      <Handle type="source" position={Position.Right} id={parent} />
    </div>
  );
}

function OutputNode({ data }) {
  const { label, parent } = data;

  return (
    <div className="react-flow__node-content">
      <Handle type="target" position={Position.Left} id={parent} />
      <div>{label}</div>
    </div>
  );
}

export default Flow;
