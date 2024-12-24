import {
    GET_TEACHER_REQUEST,
    GET_TEACHER_SUCCESS,
    GET_TEACHER_FAIL,
    
    SIGNUP_REQUEST, 
    SIGNUP_SUCCESS, 
    SIGNUP_FAIL, 

    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGIN_REQUEST,

    LOAD_TEACHER_REQUEST,
    LOAD_TEACHER_SUCCESS,
    LOAD_TEACHER_FAIL,

    CLEAR_ERRORS,
    LOGOUT_FAIL,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    AUTH_ERROR,
    
    FORGOTPASSWORD_REQUEST,
    FORGOTPASSWORD_SUCCESS,
    FORGOTPASSWORD_FAIL,

    GOOGLE_LOGIN_REQUEST,
    GOOGLE_LOGIN_SUCCESS,
    GOOGLE_LOGIN_FAIL,

} from "../constrants/ATSConstrants"

export const teacherReducer = (state = {teacher : {}}, action) => {
    switch (action.type) {
        case SIGNUP_REQUEST:
        case LOGIN_REQUEST:
        case LOGOUT_REQUEST:
        case GOOGLE_LOGIN_REQUEST:
        case LOAD_TEACHER_REQUEST:
        case FORGOTPASSWORD_REQUEST:
            return {
                ...state,
                loading : true,
                isAuthenticated: false,
            }

        case LOGIN_SUCCESS:
        case GOOGLE_LOGIN_SUCCESS:
        case LOAD_TEACHER_SUCCESS:
        case FORGOTPASSWORD_SUCCESS:
        case LOGOUT_FAIL:
            return {
                ...state,
                loading : false,
                isAuthenticated: true,
                teacher : action.payload
            };
        case SIGNUP_FAIL:
        case LOGIN_FAIL:
        case GOOGLE_LOGIN_FAIL:
        case FORGOTPASSWORD_FAIL:
            return {
                ...state,
                loading : false,
                isAuthenticated: false,
                teacher:null,
                error: action.payload,
            };

        case AUTH_ERROR:
        case SIGNUP_SUCCESS:
        case LOGOUT_SUCCESS:
            return {
                ...state,
                loading : false,
                isAuthenticated: false,
                teacher : action.payload
            };
        
        case LOAD_TEACHER_FAIL:
            return {
                ...state,
                loading : false,
                isAuthenticated: false,
                teacher:null,
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

export const teacherDetailReducer = (state = {teacherDetails : {}}, action) => {
    switch (action.type) {
     
        case GET_TEACHER_REQUEST:
            return {
                ...state,
                loading : true,
            }
        
        case GET_TEACHER_SUCCESS:
            return {
                ...state,
                loading : false,
                teacherDetails : action.payload
            }
        
        case GET_TEACHER_FAIL:
            return {
                ...state,
                loading : false,
                teacherDetails : null,
                error : action.payload
        }
    
        default:
            return state;
    }
}
