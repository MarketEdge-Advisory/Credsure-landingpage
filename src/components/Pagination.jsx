import React from 'react';
import '../App.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  console.log('Pagination Component Rendered:', { currentPage, totalPages });

  const getVisiblePages = () => {
    if (totalPages <= 1) return [];
    
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handleClick = (page) => {
    console.log('CLICKED Page:', page);
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Don't render if only one page
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn prev-next"
        disabled={currentPage === 1}
        onClick={() => handleClick(currentPage - 1)}
      >
        Prev
      </button>
      
      {visiblePages.map((page, index) => (
        <button
          key={index}
          className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
          onClick={() => handleClick(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
      
      <button
        className="pagination-btn prev-next"
        disabled={currentPage === totalPages}
        onClick={() => handleClick(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
