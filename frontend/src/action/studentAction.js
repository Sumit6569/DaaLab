import api from "../Utility/api"
// import { getAccessToken, setAccessToken } from '../utility/tokenUtils';
import { getAccessToken, getUserType, setAccessToken } from "../Utility/tokenUtils";
import Cookies from 'js-cookie';
import { deleteAllCookies, setUserType } from "../Utility/tokenUtils";
import { toast } from 'react-toastify';

import {
    GET_STUDENT_REQUEST,
    GET_STUDENT_SUCCESS,
    GET_STUDENT_FAIL,

    SIGNUP_REQUEST, 
    SIGNUP_SUCCESS, 
    SIGNUP_FAIL, 

    LOGIN_SUCCESS,
    LOGIN_FAIL,

    LOAD_STUDENT_REQUEST,
    LOAD_STUDENT_SUCCESS,
    LOAD_STUDENT_FAIL,

    FORGOTPASSWORD_REQUEST,
    FORGOTPASSWORD_SUCCESS,
    FORGOTPASSWORD_FAIL,

    GOOGLE_LOGIN_REQUEST,
    GOOGLE_LOGIN_SUCCESS,
    GOOGLE_LOGIN_FAIL,
 } from "../constrants/ATSConstrants";


export const getStudentDetails = () => async (dispatch) => {
    try {
      dispatch({ type: GET_STUDENT_REQUEST });
  
      const {data} = await api.get("/students/getStudentDetails"); // Adjust the endpoint if necessary

      dispatch({
        type: GET_STUDENT_SUCCESS,
        payload: data,
      });
  
    } catch (error) {
      dispatch({
        type: GET_STUDENT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const studentRegister = (formData) => async (dispatch) => {
    try {
        dispatch({ type: SIGNUP_REQUEST });

        const response =await api.post("/students/register", formData, {
            headers: {
                "Content-Type" :"multipart/form-data",
            }
        });

        dispatch({
            type: SIGNUP_SUCCESS,
            payload: response.data
        });
        return response;

    } catch (error) {
        dispatch({
            type: SIGNUP_FAIL,
            payload: error.response.data.message || error.message
        });
        throw error;
    }
};

export const studentLogin = (credentials) => async (dispatch) => {
    try {
        const response = await api.post("/students/login", credentials);
        console.log(response)
        const { tokens } = response.data; // Adjust based on your response structure
        const { accessToken } = tokens; // Extract the access token

        const dataType = response.data.student.provider

        if (!accessToken) {
            throw new Error('Access token not found');
        }

        setUserType(dataType);
        
        // Save token in cookies
        Cookies.set('token', accessToken, { expires: 7, path: '/' }); // Token will be stored for 7 days
        dispatch({ type: LOGIN_SUCCESS, payload: response.data });
        return response;
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const forgetPassword = (userData) => async (dispatch) => {
    try {
        dispatch({ type: FORGOTPASSWORD_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await api.post('/users/forgetPassword', userData, config);

        dispatch({
            type: FORGOTPASSWORD_SUCCESS,
            payload: response.data
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

export const loadStudents = () => async (dispatch) => {
    try {
        if (getUserType() === "student") {
        dispatch({ type: LOAD_STUDENT_REQUEST });

        // Try to retrieve the token from localStorage first, then fallback to cookies
        const accessToken = localStorage.getItem('accessToken') || Cookies.get('token');
        console.log('Access token retrieved:', accessToken);

        if (!accessToken) {
            throw new Error("Access token not found");
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        
            const { data } = await api.get("/students/getStudent", config);
            
            // console.log('API response:', data.email);

            dispatch({
                type: LOAD_STUDENT_SUCCESS,
                payload: data
            });
        
        }

    } catch (error) {
        dispatch({
          type: LOAD_STUDENT_FAIL,
          payload: error.response?.data?.message || error.message,
        });
      }
      
};

export const googleLogin = (tokens) => async (dispatch) => {
  try {
      dispatch({ type: GOOGLE_LOGIN_REQUEST });

      const config = {
          headers: {
              'Content-Type': 'application/json'
          }
      };
      console.log("Making POST request to /users/googleLogin with tokens:", tokens);
 
      const response = await api.post('/users/googleLogin', tokens, config);

      const { accessToken, refreshToken, user } = response.data.data;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);

      localStorage.setItem('refreshToken', refreshToken);

      const dataType = "student";
      setUserType(dataType);
      
      // Dispatch success with user data
      dispatch({
          type: GOOGLE_LOGIN_SUCCESS,
          payload: user,
      });
      toast.success("Login Successfully!")
      return response;

  } catch (error) {
      toast.error('Google Login Error:', error.response.data.message || error.message);
      dispatch({
          type: GOOGLE_LOGIN_FAIL,
          payload: error.response.data.message || error.message,
      });

      throw error;
  }
};