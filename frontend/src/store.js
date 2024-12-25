import { configureStore } from "@reduxjs/toolkit";
import  { studentDetailReducer, studentReducer } from "./reducer/studentReducer";
import {teacherReducer, teacherDetailReducer} from "./reducer/teacherReducer"
import { activityReducer, assignmentReducer, sectionReducer, studentWorkReducer,  } from "./reducer/assignmentReducer";


const store = configureStore ({
    reducer: {
        student: studentReducer,
        studentDetails: studentDetailReducer,
        teacher: teacherReducer,
        teacherDetails: teacherDetailReducer,
        assignment: assignmentReducer,
        section: sectionReducer,
        studentWork: studentWorkReducer,
        activity: activityReducer,
    }
})

export default store;

