import React, { useState, useEffect } from "react";
import "./Slider.css"; // Import the CSS for the slider animations and styles

function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      imgSrc: "/clg1.jpeg",
      alt: "Slide 1",
    },
    {
      imgSrc: "/clg2.png",
      alt: "Slide 2",
    },
    {
      imgSrc: "clg3.png",
      alt: "Slide 3",
    },
  ];

  // Automatically move to the next slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      id="default-carousel"
      className="slider-container"
      data-carousel="slide"
    >
      <div className="slider-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slider-item ${
              activeIndex === index ? "active" : "inactive"
            }`}
            data-carousel-item
          >
            <img src={slide.imgSrc} className="slider-image" alt={slide.alt} />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`indicator-dot ${
              activeIndex === index ? "active-dot" : ""
            }`}
            aria-current={activeIndex === index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          ></button>
        ))}
      </div>

      {/* Controls - Previous */}
      <button className="slider-control prev" onClick={handlePrev}>
        <span className="control-icon">&#10094;</span>
      </button>

      {/* Controls - Next */}
      <button className="slider-control next" onClick={handleNext}>
        <span className="control-icon">&#10095;</span>
      </button>
      
    </div>
  );
}

export default Slider;
