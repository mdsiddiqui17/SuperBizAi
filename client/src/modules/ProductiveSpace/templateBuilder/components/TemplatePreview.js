// client/src/modules/ProductiveSpace/templateBuilder/components/TemplatePreview.js
import React from 'react';

const TemplatePreview = ({ structure }) => {
  if (!structure || !Array.isArray(structure) || structure.length === 0) {
    return <p className="text-muted"><em>No content to preview.</em></p>;
  }

  const renderBlock = (block) => {
    const { type, data, id } = block;

    switch (type) {
      case 'heading':
        if (data.level === 1) {
          return <h1 key={id} className="display-5 mt-3 mb-2">{data.text || ''}</h1>;
        }
        if (data.level === 2) {
          return <h2 key={id} className="display-6 mt-3 mb-2">{data.text || ''}</h2>;
        }
        // Add H3, H4 etc. as needed, or a more generic approach
        return <h3 key={id} className="mt-3 mb-2">{data.text || ''}</h3>; // Default to H3 for other levels

      case 'paragraph':
        // Replace newlines with <br /> tags for display if content is plain text
        // If content could be HTML, use dangerouslySetInnerHTML (with caution and sanitization if from user input)
        // For plain text:
        const paragraphContent = (data.text || '').split('\n').map((line, index, arr) => (
          <React.Fragment key={index}>
            {line}
            {index < arr.length - 1 && <br />}
          </React.Fragment>
        ));
        return <p key={id} className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{paragraphContent}</p>;
        // Or for simple pre-wrap:
        // return <p key={id} style={{ whiteSpace: 'pre-wrap' }}>{data.text || ''}</p>;


      case 'checklist':
        if (!data.items || data.items.length === 0) {
          return <div key={id} className="mb-2 text-muted"><em>Empty checklist.</em></div>;
        }
        return (
          <ul key={id} className="list-unstyled mb-2 ps-3"> {/* Use list-unstyled for less default styling */}
            {data.items.map((item) => (
              <li key={item.id} className="d-flex align-items-center my-1">
                <input
                  type="checkbox"
                  checked={!!item.checked}
                  readOnly
                  disabled
                  className="form-check-input me-2"
                  style={{cursor: 'default'}}
                />
                <span style={item.checked ? { textDecoration: 'line-through', color: '#6c757d' } : {}}>
                  {item.text || ''}
                </span>
              </li>
            ))}
          </ul>
        );

      case 'image':
        if (!data.url) {
          return <div key={id} className="mb-2 text-muted"><em>Image URL not provided.</em></div>;
        }
        return (
          <figure key={id} className="mb-3 text-center">
            <img
              src={data.url}
              alt={data.caption || 'Template image'}
              style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px', border: '1px solid #eee' }}
            />
            {data.caption && <figcaption className="figure-caption text-center mt-1">{data.caption}</figcaption>}
          </figure>
        );

      case 'divider':
        return <hr key={id} className="my-4" style={{ borderStyle: 'dashed' }} />;

      default:
        return <p key={id} className="text-warning small"><em>Unsupported block type: {type}</em></p>;
    }
  };

  return (
    <div className="template-preview p-3 border rounded bg-white">
      {structure.map(block => renderBlock(block))}
    </div>
  );
};

export default TemplatePreview;
