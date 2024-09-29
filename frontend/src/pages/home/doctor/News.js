import React from 'react';
import './News.css';  // Custom styles for the blog

const News = ({ article }) => {
  return (
    <div className="blog-container">
      <div className="blog-post">
        {/* Display the article image at the top */}
        {article.urlToImage ? (
          <img src={article.urlToImage} alt="Article visual" className="blog-image" />
        ) : (
          <div>No image available</div>
        )}

        {/* Blog post content */}
        <div className="blog-content">
          {/* Conditionally render the title */}
          {article.title && <h1 className="blog-title">{article.title}</h1>}
          
          <div className="blog-info">
            <p className="blog-author">
              {article.author ? `By ${article.author}` : 'Unknown Author'}
            </p>
            <p className="blog-date">
              Published on {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <p className="blog-source">
              Source: {article.source.name}
            </p>
          </div>

          {/* Article body */}
          <div className="blog-body">
            <p>{article.content || article.description || "No additional content available."}</p>
          </div>

          {/* Link to the full article */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-full-article"
          >
            Read the full article here
          </a>
        </div>
      </div>
    </div>
  );
};

export default News;
