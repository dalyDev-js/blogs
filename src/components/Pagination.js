import "../styles/Pagination.css";
const Pagination = ({ currentPage, setPage }) => (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setPage(currentPage - 1)}>
      Previous
    </button>
    <button onClick={() => setPage(currentPage + 1)}>Next</button>
  </div>
);

export default Pagination;
