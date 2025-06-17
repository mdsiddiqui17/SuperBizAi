// client/src/modules/ProductiveSpace/ProductiveSpaceLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProductiveSpaceNav from './components/ProductiveSpaceNav'; // Ensure this path is correct

const ProductiveSpaceLayout = () => {
  return (
    <div className="container mt-4"> {/* Standard Bootstrap container with top margin */}
      {/*
        You could add a consistent header for the Productive Space module here if desired,
        for example:
        <header className="mb-3">
          <h1>Productive Space</h1>
        </header>
      */}
      <ProductiveSpaceNav />
      <hr className="my-3" /> {/* Visual separator below the navigation */}
      <div className="productive-space-content py-3"> {/* Padding for the content area */}
        <Outlet /> {/* Child route components (TasksPage, NotesPage, etc.) will render here */}
      </div>
    </div>
  );
};

export default ProductiveSpaceLayout;
