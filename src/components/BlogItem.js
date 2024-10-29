"use client";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import "../styles/BlogItem.css";

const BlogItem = ({ post }) => {
  const { title, user, published_at, cover_image, url, description, tag_list } =
    post;

  return (
    <div className="blog-item">
      <div className="cover-image-container">
        <img
          src={cover_image || "blog.png"}
          alt={title}
          className="cover-image"
        />
      </div>
      <p className="category">{tag_list[0] || "General"}</p>

      <div className="post-title-container">
        <h2 className="post-title">
          {title.length > 70 ? `${title.slice(0, 60)}...` : title}
        </h2>
        <Link href={url} target="_blank" className="external-link">
          <FiArrowUpRight />
        </Link>
      </div>

      <p className="description">
        {description ? `${description.slice(0, 99)}...` : ""}
      </p>

      <div className="author-info">
        <img
          src={user.profile_image}
          alt={user.name}
          className="author-image"
        />
        <div className="author-details">
          <span className="name">{user.name}</span>
          <span className="date">
            {new Date(published_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
