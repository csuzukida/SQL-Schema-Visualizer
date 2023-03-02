import React, { useState } from 'react';

function Buttons(props) {
  const [showMenu, setShowMenu] = useState(false);
  const [nodeType, setNodeType] = useState('group');
  const [nodeName, setNodeName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (nodeType === 'group' && nodeName.trim()) {
      props.onAddNode(nodeName);
    }
    setShowMenu(false);
    setNodeType('group');
    setNodeName('');
  };

  const handleMenuClick = () => {
    setShowMenu(true);
  };

  const handleRadioChange = (e) => setNodeType(e.target.value);
  const handleNameChange = (e) => setNodeName(e.target.value);

  return (
    <div className="buttons">
      <button type="button" onClick={handleMenuClick}>
        Add Node
      </button>
      {showMenu && (
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="radio"
              value="group"
              checked={nodeType === 'group'}
              onChange={handleRadioChange}
            />
            Group
          </label>
          <label>
            <input
              type="radio"
              value="foreign-key"
              checked={nodeType === 'foreign-key'}
              onChange={handleRadioChange}
            />
            Foreign Key
          </label>
          {nodeType === 'group' && (
            <input type="text" value={nodeName} onChange={handleNameChange} />
          )}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default Buttons;
