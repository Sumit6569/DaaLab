import {
    GET_STUDENT_REQUEST,
    GET_STUDENT_SUCCESS,
    GET_STUDENT_FAIL,
    
    SIGNUP_REQUEST, 
    SIGNUP_SUCCESS, 
    SIGNUP_FAIL, 

    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGIN_REQUEST,

    LOAD_STUDENT_REQUEST,
    LOAD_STUDENT_SUCCESS,
    LOAD_STUDENT_FAIL,

    CLEAR_ERRORS,
    LOGOUT_FAIL,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    STUDENT_LOADED,
    AUTH_ERROR,
    
    FORGOTPASSWORD_REQUEST,
    FORGOTPASSWORD_SUCCESS,
    FORGOTPASSWORD_FAIL,

    GOOGLE_LOGIN_REQUEST,
    GOOGLE_LOGIN_SUCCESS,
    GOOGLE_LOGIN_FAIL,
    
} from "../constrants/ATSConstrants.js"

export const studentReducer = (state = {STUDENT : {}}, action) => {
    switch (action.type) {
        case SIGNUP_REQUEST:
        case LOGIN_REQUEST:
        case LOGOUT_REQUEST:
        case GOOGLE_LOGIN_REQUEST:
        case LOAD_STUDENT_REQUEST:
        case FORGOTPASSWORD_REQUEST:
            return {
                ...state,
                loading : true,
                isAuthenticated: false,
            }

        case LOGIN_SUCCESS:
        case GOOGLE_LOGIN_SUCCESS:
        case LOAD_STUDENT_SUCCESS:
        case FORGOTPASSWORD_SUCCESS:
        case LOGOUT_FAIL:
        case STUDENT_LOADED:
            return {
                ...state,
                loading : false,
                isAuthenticated: true,
                student : action.payload
            };
        case SIGNUP_FAIL:
        case LOGIN_FAIL:
        case GOOGLE_LOGIN_FAIL:
        case FORGOTPASSWORD_FAIL:
            return {
                ...state,
                loading : false,
                isAuthenticated: false,
                student:null,
                error: action.payload,
            };

        case AUTH_ERROR:
        case SIGNUP_SUCCESS:
        case LOGOUT_SUCCESS:
            return {
                ...state,
                loading : false,
                isAuthenticated: false,
                student : action.payload
            };
        
        case LOAD_STUDENT_FAIL:
            return {
                ...state,
                loading : false,
                isAuthenticated: false,
                student:null,
                error: action.payload,
            }
        
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
            
    
        default:
            return state;
    }
}

const initialState = {
    studentDetails: {
      data: [],  // Initialize it as an empty array or any default value
    },
    loading: false,
    error: null,
  };


export const studentDetailReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_STUDENT_REQUEST:
            return {
                ...state,
                loading : true,
            }
        
        case GET_STUDENT_SUCCESS:
            return {
                ...state,
                loading : false,
                studentDetails : action.payload
            }
        
        case GET_STUDENT_FAIL:
            return {
                ...state,
                loading : false,
                studentDetails : null,
                error : action.payload
        }
    
        default:
            return state;
    }
}
