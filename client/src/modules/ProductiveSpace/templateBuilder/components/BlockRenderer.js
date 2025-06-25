// client/src/modules/ProductiveSpace/templateBuilder/components/BlockRenderer.js
import React from 'react';

// Inline styles blockStyle and blockActionsStyle removed as they are now in templateBuilder.css

const BlockRenderer = ({
  block,
  onContentChange,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  isFirstBlock, // To disable move up for the first block
  isLastBlock   // To disable move down for the last block
}) => {

  const handleInputChange = (e, field, index = null) => {
    const { value, checked, type } = e.target;
    let newData = { ...block.data };

    if (block.type === 'checklist' && index !== null) {
      newData.items = newData.items.map((item, i) =>
        i === index ? { ...item, [field]: type === 'checkbox' ? checked : value } : item
      );
    } else {
      newData = { ...newData, [field]: value };
    }
    onContentChange(block.id, newData);
  };

  const handleGenericDataChange = (field, value) => {
    const newData = { ...block.data, [field]: value };
    onContentChange(block.id, newData);
  };

  const addChecklistItem = () => {
    if (block.type === 'checklist') {
      const newItem = { id: `item-${Date.now()}`, text: '', checked: false };
      const newData = {
        ...block.data,
        items: [...(block.data.items || []), newItem],
      };
      onContentChange(block.id, newData);
    }
  };

  const removeChecklistItem = (itemIdToRemove) => {
    if (block.type === 'checklist') {
      const newData = {
        ...block.data,
        items: block.data.items.filter(item => item.id !== itemIdToRemove),
      };
      onContentChange(block.id, newData);
    }
  };


  const renderBlockContent = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div>
            <select
              value={block.data.level || 1}
              onChange={(e) => handleGenericDataChange('level', parseInt(e.target.value, 10))}
              className="form-select form-select-sm d-inline-block w-auto me-2"
            >
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              {/* Add H3, H4 if needed */}
            </select>
            <input
              type="text"
              value={block.data.text || ''}
              onChange={(e) => handleInputChange(e, 'text')}
              placeholder="Heading text"
              className="form-control d-inline-block"
              style={{ width: 'calc(100% - 100px)'}} // Adjust width as needed
            />
          </div>
        );
      case 'paragraph':
        return (
          <textarea
            value={block.data.text || ''}
            onChange={(e) => handleInputChange(e, 'text')}
            placeholder="Paragraph text..."
            className="form-control"
            rows={3}
          />
        );
      case 'checklist':
        return (
          <div>
            {(block.data.items || []).map((item, index) => (
              <div key={item.id || index} className="d-flex align-items-center mb-1">
                <input
                  type="checkbox"
                  checked={!!item.checked}
                  onChange={(e) => handleInputChange(e, 'checked', index)}
                  className="form-check-input me-2"
                />
                <input
                  type="text"
                  value={item.text || ''}
                  onChange={(e) => handleInputChange(e, 'text', index)}
                  placeholder="Checklist item"
                  className="form-control form-control-sm"
                />
                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => removeChecklistItem(item.id)}
                    title="Remove item"
                >
                    &times;
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={addChecklistItem}>
              + Add item
            </button>
          </div>
        );
      case 'image':
        return (
          <div>
            <input
              type="url"
              value={block.data.url || ''}
              onChange={(e) => handleInputChange(e, 'url')}
              placeholder="Image URL (e.g., https://...)"
              className="form-control mb-2"
            />
            {block.data.url && <img src={block.data.url} alt={block.data.caption || 'template image'} style={{ maxWidth: '100%', maxHeight: '200px', display:'block', marginBottom:'5px' }} />}
            <input
              type="text"
              value={block.data.caption || ''}
              onChange={(e) => handleInputChange(e, 'caption')}
              placeholder="Optional caption"
              className="form-control form-control-sm"
            />
          </div>
        );
      case 'divider':
        return <hr />; // Style handled by .template-block hr in CSS
      default:
        return <p>Unsupported block type: {block.type}</p>;
    }
  };

  return (
    <div className="template-block"> {/* Removed style={blockStyle} */}
      <div className="template-block-actions"> {/* Removed style={blockActionsStyle} */}
        <button
            type="button"
            onClick={() => onMoveBlockUp(block.id)}
            disabled={isFirstBlock}
            className="btn btn-sm btn-light"
            title="Move Up"
        >
            &#x25B2; {/* Up arrow */}
        </button>
        <button
            type="button"
            onClick={() => onMoveBlockDown(block.id)}
            disabled={isLastBlock}
            className="btn btn-sm btn-light"
            title="Move Down"
        >
            &#x25BC; {/* Down arrow */}
        </button>
        <button
            type="button"
            onClick={() => onRemoveBlock(block.id)}
            className="btn btn-sm btn-danger"
            title="Remove Block"
        >
            &#x2715; {/* X mark */}
        </button>
      </div>
      {renderBlockContent()}
    </div>
  );
};

export default BlockRenderer;
