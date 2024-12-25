
import api from "../Utility/api";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'
import { 
  CREATE_ASSIGNMENT_FAIL,
  CREATE_ASSIGNMENT_REQUEST,
    CREATE_ASSIGNMENT_SUCCESS,
    DELETE_ASSIGNMENT_FAIL,
    DELETE_ASSIGNMENT_REQUEST,
    DELETE_ASSIGNMENT_SUCCESS,
    GET_ACTIVITY_FAIL,
    GET_ACTIVITY_REQUEST,
    GET_ACTIVITY_SUCCESS,
    GET_ASSIGNMENT_FAIL,
    GET_ASSIGNMENT_REQUEST,
    GET_ASSIGNMENT_SUCCESS,
    GET_SECTION_FAIL,
    GET_SECTION_REQUEST,
    GET_SECTION_SUCCESS,
    GET_WORK_FAIL,
    GET_WORK_REQUEST,
    GET_WORK_SUCCESS,
    LOAD_ASSIGNMENT_FAIL,
    LOAD_ASSIGNMENT_REQUEST,
    LOAD_ASSIGNMENT_SUCCESS,
    SUBMIT_ASSIGNMENT_FAIL,
    SUBMIT_ASSIGNMENT_REQUEST,
    SUBMIT_ASSIGNMENT_SUCCESS,
    // GET_SECTION_REQUEST,
 } from "../constrants/ATSConstrants";



export const getAssignmentDetails = () => async (dispatch) => {
    try {
      dispatch({ type: GET_ASSIGNMENT_REQUEST });
  
      const {data} = await api.get("assignments/assignmentDetails"); // Adjust the endpoint if necessary
      
      dispatch({
        type: GET_ASSIGNMENT_SUCCESS,
        payload: data,
      });
  
    } catch (error) {
      console.log("error");
      
      dispatch({
        type: GET_ASSIGNMENT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const loadAssignment = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_ASSIGNMENT_REQUEST });

    const {data} = await api.get("assignments/assignmentDetails"); // Adjust the endpoint if necessary
    
    dispatch({
      type: LOAD_ASSIGNMENT_SUCCESS,
      payload: data,
    });

  } catch (error) {
    console.log("error");
    
    dispatch({
      type: LOAD_ASSIGNMENT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getSectionDetails = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SECTION_REQUEST });

    const {data} = await api.get("assignments/sectionDetails"); // Adjust the endpoint if necessary
    
    dispatch({
      type: GET_SECTION_SUCCESS,
      payload: data,
    });

  } catch (error) {
    console.log("error");
    
    dispatch({
      type: GET_SECTION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getStudentWorkDetails = () => async (dispatch) => {
  try {
    dispatch({ type: GET_WORK_REQUEST });

    const {data} = await api.get("assignments/studentWorkDetails"); // Adjust the endpoint if necessary

    dispatch({
      type: GET_WORK_SUCCESS,
      payload: data,
    });

  } catch (error) {
    console.log("error");
    
    dispatch({
      type: GET_WORK_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createAssignment = (formData) => async (dispatch) => {
  try {
      dispatch({ type: CREATE_ASSIGNMENT_REQUEST });

      const response =await api.post("/assignments/createAssignment", formData, {
          headers: {
              "Content-Type" :"multipart/form-data",
          }
      });

      dispatch({
          type: CREATE_ASSIGNMENT_SUCCESS,
          payload: response.data
      });
      return response;

  } catch (error) {
      dispatch({
          type: CREATE_ASSIGNMENT_FAIL,
          payload: error.response.data.message || error.message
      });
      throw error;
  }
};

export const submitAssignment = (formData) => async (dispatch) => {
  
  try {
    dispatch({ type: SUBMIT_ASSIGNMENT_REQUEST });

    const accessToken = localStorage.getItem('accessToken') || Cookies.get('token');
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await api.post(
        "/assignments/submitWork",
        formData,
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    dispatch({
        type: SUBMIT_ASSIGNMENT_SUCCESS,
        payload: response.data,
    });

    return response;

  } catch (error) {
    console.error('Error during assignment submission:', error.response?.data || error.message);
    dispatch({
        type: SUBMIT_ASSIGNMENT_FAIL,
        payload: error.response?.data?.message || error.message,
    });
    throw error;
  }

};

export const deleteAssignment = (data) => async (dispatch) => {
  
  try {
    dispatch({ type: DELETE_ASSIGNMENT_REQUEST });

    const accessToken = localStorage.getItem('accessToken') || Cookies.get('token');
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await api.post( "/assignments/deleteAssignment",
      data,
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        }
    );

    dispatch({
        type: DELETE_ASSIGNMENT_SUCCESS,
        payload: response.data,
    });

    return response;

  } catch (error) {
    console.error('Error during assignment deletion:', error.response?.data || error.message);
    dispatch({
        type: DELETE_ASSIGNMENT_FAIL,
        payload: error.response?.data?.message || error.message,
    });
    throw error;
  }

};

export const getActivityDetails = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ACTIVITY_REQUEST });

    const {data} = await api.get("assignments/getActivityDetails"); // Adjust the endpoint if necessary
    
    dispatch({
      type: GET_ACTIVITY_SUCCESS,
      payload: data,
    });

  } catch (error) {
    console.log("error");
    
    dispatch({
      type: GET_ACTIVITY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};