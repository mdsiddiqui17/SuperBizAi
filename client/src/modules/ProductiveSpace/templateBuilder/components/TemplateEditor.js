// client/src/modules/ProductiveSpace/templateBuilder/components/TemplateEditor.js
import React, { useState, useEffect, useCallback } from 'react';
import BlockRenderer from './BlockRenderer';
import '../styles/templateBuilder.css'; // Adjust path if CSS file is elsewhere
// Consider using a UUID library for more robust unique IDs in a production app
// import { v4 as uuidv4 } from 'uuid';

// Helper to generate simple unique IDs for this example
const generateBlockId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const TemplateEditor = ({ initialStructure, onStructureChange }) => {
  const [blocks, setBlocks] = useState([]);
  const [newBlockType, setNewBlockType] = useState('paragraph'); // Default new block type

  useEffect(() => {
    // Initialize with initialStructure or a default empty block if none provided
    if (initialStructure && initialStructure.length > 0) {
      setBlocks(initialStructure);
    } else {
      // Optionally start with one default block if initialStructure is empty
      // setBlocks([{ id: generateBlockId(), type: 'paragraph', data: { text: '' } }]);
      setBlocks([]);
    }
  }, [initialStructure]);

  // Notify parent component of structure changes
  useEffect(() => {
    if (onStructureChange) {
      onStructureChange(blocks);
    }
  }, [blocks, onStructureChange]);

  const addBlock = (type) => {
    let defaultData = {};
    switch (type) {
      case 'heading':
        defaultData = { text: '', level: 1 };
        break;
      case 'paragraph':
        defaultData = { text: '' };
        break;
      case 'checklist':
        defaultData = { items: [{ id: `item-${Date.now()}`, text: '', checked: false }] };
        break;
      case 'image':
        defaultData = { url: '', caption: '' };
        break;
      case 'divider':
        defaultData = {}; // No data needed
        break;
      default:
        console.warn('Attempted to add unknown block type:', type);
        return;
    }
    const newBlock = { id: generateBlockId(), type, data: defaultData };
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
  };

  const handleAddBlockClick = () => {
    addBlock(newBlockType);
  };

  const handleBlockContentChange = useCallback((blockId, newData) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? { ...block, data: newData } : block
      )
    );
  }, []);

  const handleRemoveBlock = useCallback((blockId) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  }, []);

  const handleMoveBlock = useCallback((blockId, direction) => {
    setBlocks(prevBlocks => {
      const index = prevBlocks.findIndex(block => block.id === blockId);
      if (index === -1) return prevBlocks;

      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= prevBlocks.length) return prevBlocks; // Out of bounds

      const newBlocks = [...prevBlocks];
      const [movedBlock] = newBlocks.splice(index, 1); // Remove block from old position
      newBlocks.splice(newIndex, 0, movedBlock); // Insert block into new position
      return newBlocks;
    });
  }, []);

  return (
    <div className="template-editor my-3 p-3 border rounded bg-light">
      {blocks.map((block, index) => (
        <BlockRenderer
          key={block.id}
          block={block}
          onContentChange={handleBlockContentChange}
          onRemoveBlock={handleRemoveBlock}
          onMoveBlockUp={() => handleMoveBlock(block.id, 'up')}
          onMoveBlockDown={() => handleMoveBlock(block.id, 'down')}
          isFirstBlock={index === 0}
          isLastBlock={index === blocks.length - 1}
        />
      ))}

      <div className="add-block-controls mt-3 p-3 border-top">
        <label htmlFor="newBlockTypeSelect" className="form-label me-2">Add New Block:</label>
        <select
          id="newBlockTypeSelect"
          className="form-select form-select-sm d-inline-block w-auto me-2"
          value={newBlockType}
          onChange={(e) => setNewBlockType(e.target.value)}
        >
          <option value="paragraph">Paragraph</option>
          <option value="heading">Heading</option>
          <option value="checklist">Checklist</option>
          <option value="image">Image</option>
          <option value="divider">Divider</option>
        </select>
        <button type="button" className="btn btn-sm btn-success" onClick={handleAddBlockClick}>
          + Add Block
        </button>
      </div>
    </div>
  );
};

export default TemplateEditor;
