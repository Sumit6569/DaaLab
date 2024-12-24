// ImageComp.js
import React from "react";
import "./ImageComp.css";

function ImageComp() {
  return (
    <div className="image-container">
      <h1 className="image-title">Welcome to Design And Algo Lab</h1>

      <div className="image-wrapper">
        <figure className="relative">
          <a href="#">
            <img
              className="image-item"
              src="/img1.webp"
              alt="Image 1 description"
            />
          </a>
        </figure>
        <figure className="relative">
          <a href="#">
            <img
              className="image-item"
              src="/img2.jpg"
              alt="Image 2 description"
            />
          </a>
        </figure>
        <figure className="relative">
          <a href="#">
            <img
              className="image-item"
              src="/img3.jpg"
              alt="Image 3 description"
            />
          </a>
        </figure>
        <figure className="relative">
          <a href="#">
            <img
              className="image-item"
              src="/img4.jpg"
              alt="Image 4 description"
            />
          </a>
        </figure>
        <figure className="relative">
          <a href="#">
            <img
              className="image-item"
              src="/img5.jpg"
              alt="Image 5 description"
            />
          </a>
        </figure>
      </div>
    </div>
  );
}

export default ImageComp;
