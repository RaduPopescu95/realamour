import React from "react";

export default function Pagination({ usersPerPage, totalUsers, paginate, currentPage }) {
  const pageNumbers = [];

  // Determină numărul total de pagini
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination -buttons">
      <button
        className="pagination__button -prev"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <i className="icon icon-chevron-left"></i>
      </button>

      <div className="pagination__count">
        {pageNumbers.map((number) => (
          <a
            key={number}
            href="#"
            className={`pagination__link ${currentPage === number ? "-count-is-active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              paginate(number);
            }}
          >
            {number}
          </a>
        ))}
      </div>

      <button
        className="pagination__button -next"
        onClick={() => paginate(Math.min(pageNumbers.length, currentPage + 1))}
        disabled={currentPage === pageNumbers.length}
      >
        <i className="icon icon-chevron-right"></i>
      </button>
    </div>
  );
}
