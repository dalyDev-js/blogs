// src/components/BlogList.js
"use client";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import BlogItem from "./BlogItem";
import { fetchPosts } from "../services/api";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import Header from "./Header";
import "../styles/BlogList.css";

const BlogList = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const normalPerPage = 12;

  // Fetch posts when `page` changes for regular pagination
  useEffect(() => {
    if (!searchQuery) {
      loadPosts(page, normalPerPage);
    }
  }, [page]);

  // Fetch all matching posts when searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery]);

  const loadPosts = async (currentPage, perPage) => {
    setLoading(true);
    try {
      const newPosts = await fetchPosts(currentPage, perPage);
      console.log("API Response:", newPosts);

      setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setFilteredPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setIsLastPage(newPosts.length < perPage);
    } catch {
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors on a new search
    try {
      const newPosts = await fetchPosts(1, 1000); // Fetch all for search
      console.log("API Search Response:", newPosts);

      const filtered = newPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
      setIsLastPage(true); // Disable pagination in search results
    } catch {
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setPage(1); // Reset pagination
      setAllPosts([]); // Clear posts during new search
      setFilteredPosts([]);
      setIsLastPage(false); // Reset pagination state
    }, 300),
    []
  );

  const loadMorePosts = () => {
    if (!isLastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="blog-list-container">
      <Header onSearch={handleSearch} />
      {loading && <LoadingIndicator />}
      {error && (
        <ErrorMessage
          message={error}
          retry={() => loadPosts(page, normalPerPage)}
        />
      )}

      <div className="blog-list">
        {filteredPosts.length > 0 && !loading
          ? filteredPosts.map((post) => <BlogItem key={post.id} post={post} />)
          : !loading && <p>No blogs found.</p>}
      </div>

      {!searchQuery && !isLastPage && !loading && filteredPosts.length > 0 && (
        <button className="load-more" onClick={loadMorePosts}>
          <span className="arrow-icon">↓</span> Load more
        </button>
      )}
    </div>
  );
};

export default BlogList;
