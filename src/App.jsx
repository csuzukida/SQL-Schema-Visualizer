import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Flow from './Flow';

function App() {
  return (
    <ReactFlowProvider>
      <div className="container">
        <Flow />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
