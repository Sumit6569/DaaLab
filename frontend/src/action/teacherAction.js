import api from "../Utility/api";
import Cookies from "js-cookie";
import { deleteAllCookies, clearUserType, setUserType, getAccessToken, getUserType } from "../Utility/tokenUtils";
import { toast } from "react-toastify";

import {
  GET_TEACHER_REQUEST,
  GET_TEACHER_SUCCESS,
  GET_TEACHER_FAIL,

  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,

  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,

  LOAD_TEACHER_REQUEST,
  LOAD_TEACHER_SUCCESS,
  LOAD_TEACHER_FAIL,

  FORGOTPASSWORD_REQUEST,
  FORGOTPASSWORD_SUCCESS,
  FORGOTPASSWORD_FAIL,
  DELETE_TEACHER_REQUEST,
  DELETE_TEACHER_SUCCESS,
  DELETE_TEACHER_FAIL,

} from "../constrants/ATSConstrants";

export const getTeacherDetails = () => async (dispatch) => {
  try {
    dispatch({ type: GET_TEACHER_REQUEST });

    const { data } = await api.get("/teachers/getTeacherDetails"); // Adjust the endpoint if necessary
    
    dispatch({
      type: GET_TEACHER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TEACHER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const teacherRegister = (formData) => async (dispatch) => {
  try {
    dispatch({ type: SIGNUP_REQUEST });

    const response = await api.post("/teachers/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: response.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: SIGNUP_FAIL,
      payload: error.response.data.message || error.message,
    });
    throw error;
  }
};

export const teacherLogin = (credentials) => async (dispatch) => {
  try {
    const response = await api.post("/teachers/login", credentials);

    const { tokens } = response.data; // Adjust based on your response structure
    const { accessToken } = tokens; // Extract the access token

    const dataType = response.data.teacher.provider

    if (!accessToken) {
      throw new Error("Access token not found");
    }
    console.log("Pk", dataType)

    setUserType(dataType);

    // Save token in cookies
    Cookies.set("token", accessToken, { expires: 7, path: "/" }); // Token will be stored for 7 days
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    return response;
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const adminLogin = (credentials) => async (dispatch) => {
  try {
    const response = await api.post("/teachers/adminlogin", credentials);
    console.log("hello login", response);

    const { tokens } = response.data; // Adjust based on your response structure
    const { accessToken } = tokens; // Extract the access token

    const dataType = response.data.teacher.provider

    if (!accessToken) {
      throw new Error("Access token not found");
    }

    setUserType(dataType);

    // Save token in cookies
    Cookies.set("token", accessToken, { expires: 7, path: "/" }); // Token will be stored for 7 days
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    return response;
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  try {
    // Clear cookies
    const deleteAllCookies = () => {
      const cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    };
    deleteAllCookies();

    // Clear tokens from storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();

    dispatch({ type: LOGOUT_SUCCESS });

    clearUserType();
    
    toast.success("Logout successful");

  } catch (error) {
    toast.error("Logout error: Please refresh the page to logout");
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const forgetPassword = (userData) => async (dispatch) => {
  try {
    dispatch({ type: FORGOTPASSWORD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await api.post("/users/forgetPassword", userData, config);

    dispatch({
      type: FORGOTPASSWORD_SUCCESS,
      payload: response.data,
    });
    return response;
  } catch (error) {
    dispatch({
      type: FORGOTPASSWORD_FAIL,
      payload: error.response.data.message || error.message,
    });
    throw error;
  }
};

export const loadTeachers = () => async (dispatch) => {
  try {
    if(getUserType() === "admin" || getUserType() === "teacher") {
      dispatch({ type: LOAD_TEACHER_REQUEST });

      // Try to retrieve the token from localStorage first, then fallback to cookies
      const accessToken =
        localStorage.getItem("accessToken") || Cookies.get("token");
      console.log("Access token retrieved:", accessToken);

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };



      const { data } = await api.get("teachers/getTeacher", config);
      // console.log("API response:", data);
      
      dispatch({
        type: LOAD_TEACHER_SUCCESS,
        payload: data,
      });
    }
  } catch (error) {
    dispatch({
      type: LOAD_TEACHER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteTeacher = (data) => async (dispatch) => {
  
  try {
    dispatch({ type: DELETE_TEACHER_REQUEST });

    const accessToken = localStorage.getItem('accessToken') || Cookies.get('token');
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await api.post( "/teachers/deleteTeacher",
      data,
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        }
    );

    dispatch({
        type: DELETE_TEACHER_SUCCESS,
        payload: response.data,
    });

    return response;

  } catch (error) {
    console.error('Error during assignment deletion:', error.response?.data || error.message);
    dispatch({
        type: DELETE_TEACHER_FAIL,
        payload: error.response?.data?.message || error.message,
    });
    throw error;
  }

};

