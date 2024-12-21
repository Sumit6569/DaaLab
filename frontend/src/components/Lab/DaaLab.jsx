<<<<<<< HEAD
import React from "react";
import "./DaaLab.css";
=======
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function DaaLab() {
  const [activeUnit, setActiveUnit] = useState(null);
>>>>>>> a81c10471f47b8b928fa31fcd90249276ad54bc8

  const units = [
    {
      name: "Unit 1",
      topics: [
        { name: "Topic 1.1", path: "/unit1/topic1" },
        { name: "Topic 1.2", path: "/unit1/topic2" },
        { name: "Topic 1.3", path: "/unit1/topic3" },
        { name: "Topic 1.4", path: "/unit1/topic4" },
        { name: "Topic 1.5", path: "/unit1/topic5" },
      ],
    },
    {
      name: "Unit 1",
      topics: [
        { name: "Topic 1.1", path: "/unit1/topic1" },
        { name: "Topic 1.2", path: "/unit1/topic2" },
        { name: "Topic 1.3", path: "/unit1/topic3" },
        { name: "Topic 1.4", path: "/unit1/topic4" },
        { name: "Topic 1.5", path: "/unit1/topic5" },
      ],
    },
    {
      name: "Unit 1",
      topics: [
        { name: "Topic 1.1", path: "/unit1/topic1" },
        { name: "Topic 1.2", path: "/unit1/topic2" },
        { name: "Topic 1.3", path: "/unit1/topic3" },
        { name: "Topic 1.4", path: "/unit1/topic4" },
        { name: "Topic 1.5", path: "/unit1/topic5" },
      ],
    },
    {
      name: "Unit 1",
      topics: [
        { name: "Topic 1.1", path: "/unit1/topic1" },
        { name: "Topic 1.2", path: "/unit1/topic2" },
        { name: "Topic 1.3", path: "/unit1/topic3" },
        { name: "Topic 1.4", path: "/unit1/topic4" },
        { name: "Topic 1.5", path: "/unit1/topic5" },
      ],
    },
    // Add other units here...
  ];

  const toggleUnit = (index) => {
    setActiveUnit(activeUnit === index ? null : index);
  };

  const variants = {
    open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
    closed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
  };

  const handleDownload = () => {
    const url = "/path/to/your/syllabus.pdf";
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "syllabus.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-56 bg-gray-800 text-white pt-5 pb-10 overflow-y-auto shadow-lg">
        <div className="px-4 mb-6">
          <h1 className="text-xl font-bold text-center">DaaLab</h1>
        </div>
        <nav className="px-3 mt-16">
          <ul className="space-y-3">
            {units.map((unit, index) => (
              <li key={index}>
                <button
                  onClick={() => toggleUnit(index)}
                  className="w-full flex justify-between items-center py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-all"
                >
                  <span>{unit.name}</span>
                  <motion.svg
                    className="w-4 h-4 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: activeUnit === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {activeUnit === index && (
                    <motion.ul
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={variants}
                      className="mt-20 space-y-1 pl-4 border-l-2 border-gray-600"
                    >
                      {unit.topics.map((topic, tIndex) => (
                        <motion.li key={tIndex} className="py-1">
                          <Link
                            to={topic.path}
                            className="block px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-all mt-22"
                          >
                            {topic.name}
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
          <button
            onClick={handleDownload}
            className="mt-6 w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-sm font-medium rounded-md text-center transition-all"
          >
            Download Syllabus
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-56 p-8 w-full bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default DaaLab;
