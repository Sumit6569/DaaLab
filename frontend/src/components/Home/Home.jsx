import React from "react";
import Slider from "../Slider/Slider";
 // Ensure this path is correct
import ImageGrid from "../ImageGrid";
import StartLerlingButton from "../StartLerlingButton";
import ImageComp from "../ImgComp/ImageComp";
import "./Home.css"; // Import the custom CSS for styles
import Footer from "../Footer/Footer";

function Home() {
  return (
    <div className="home-container">
      {/* Slider Component */}
      <Slider />

      {/* Objectives Section */}
      <div className="divider"></div>
      <div className="objectives-container">
        <div className="objectives-header">
          <h3 className="objectives-title">Objectives</h3>
        </div>

        <div className="objectives-content">
          <p className="objectives-text">
            1. The DAA Virtual Lab helps students understand and experiment with
            algorithm design and performance analysis.
          </p>
          <p className="objectives-text">
            2. It provides opportunities to explore various algorithmic
            techniques such as sorting, searching, graph traversal, dynamic
            programming, and greedy algorithms.
          </p>
          <p className="objectives-text">
            3. Students can observe the step-by-step execution of algorithms and
            analyze time and space complexity through hands-on testing.
          </p>
        </div>
      </div>

      {/* Image Component */}
      <ImageComp />

      {/* Start Learning Button */}
      
     
    </div>
  );
}

export default Home;
