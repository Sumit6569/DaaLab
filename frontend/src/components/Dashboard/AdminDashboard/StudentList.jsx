// import React, { useState } from "react";
// import "./StudentList.css";
// import { Link } from "react-router-dom";

// function StudentList( {studentDetails =[], section=[]}) {


//   // const handleDelete = (id) => {
//   //   const updatedStudents = students.filter((student) => student.id !== id);
//   //   setStudents(updatedStudents);
//   // };

//   // console.log(studentDetails[0].sectionId);

//   return (
//     <div className="student-list-container">
//       <h2 className="student-list-title">Students List</h2>
     
//       <table className="student-list-table">
//         <thead>
//           <tr>
//             <th>Student Name</th>
//             <th>Email</th>
//             <th>Department</th>
//             <th>Section</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {studentDetails.map((student) => (
        
//             // const matchedSection = ;
//             <tr key={student._id}>
//               <td>{student.fullName}</td>
//               <td>{student.email}</td>
//               <td>{student.branch}</td>
//               <td>{(section.data.find(sec => sec._id === student.sectionId).name)}</td>
//               <td>
//                 <button
//                   className="delete-btn"
//                   // onClick={() => handleDelete(student.id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default StudentList;






import React from "react";
import "./StudentList.css";

function StudentList({ studentDetails = [], section = {} }) {
  // Ensure section.data is initialized to an array if undefined
  const sectionData = section || [];

  // Create a lookup map for sections by ID to optimize performance
  const sectionMap = React.useMemo(() => {
    return sectionData.reduce((map, sec) => {
      map[sec._id] = sec.name;
      return map;
    }, {});
  }, [sectionData]);

  return (
    <div className="student-list-container">
      <h2 className="student-list-title">Students List</h2>

      <table className="student-list-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentDetails.map((student) => (
            <tr key={student._id}>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.branch}</td>
              <td>{sectionMap[student.sectionId] || "Unknown Section"}</td>
              <td>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
