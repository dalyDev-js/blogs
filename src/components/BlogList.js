"use client";
import { useEffect, useState, useCallback, useRef } from "react";
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
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const normalPerPage = 12;
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!searchQuery) {
      loadPosts(page, normalPerPage);
    }
  }, [page]);

  useEffect(() => {
    searchQuery ? performSearch() : resetPosts();
  }, [searchQuery]);

  const loadPosts = async (currentPage, perPage) => {
    setLoading(true);
    try {
      const newPosts = await fetchPosts(currentPage, perPage);
      const updatedPosts = [...allPosts, ...newPosts];
      setAllPosts(updatedPosts);
      setDisplayedPosts(updatedPosts);
      setIsLastPage(newPosts.length < perPage);
    } catch {
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const newPosts = await fetchPosts(1, 1000);
      const filtered = newPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
      setDisplayedPosts(filtered.slice(0, normalPerPage));
      setIsLastPage(filtered.length <= normalPerPage);
    } catch {
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPosts = () => {
    setFilteredPosts([]);
    setDisplayedPosts(allPosts);
    setIsLastPage(allPosts.length < normalPerPage);
  };

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setPage(1);
      query === "" ? resetPosts() : setDisplayedPosts([]);
      setIsLastPage(false);
    }, 300),
    []
  );

  const loadMorePosts = (event) => {
    event.preventDefault();
    if (searchQuery) {
      const nextBatch = filteredPosts.slice(
        displayedPosts.length,
        displayedPosts.length + normalPerPage
      );
      setDisplayedPosts((prevDisplayed) => [...prevDisplayed, ...nextBatch]);
      setIsLastPage(
        displayedPosts.length + nextBatch.length >= filteredPosts.length
      );
    } else {
      setPage((prevPage) => prevPage + 1);
      loadMoreRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
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
        {displayedPosts.length > 0 && !loading
          ? displayedPosts.map((post) => <BlogItem key={post.id} post={post} />)
          : !loading && <p>No blogs found.</p>}
      </div>
      {!isLastPage && !loading && displayedPosts.length > 0 && (
        <button className="load-more" onClick={loadMorePosts} ref={loadMoreRef}>
          <span className="arrow-icon">↓</span> Load more
        </button>
      )}
    </div>
  );
};

export default BlogList;
