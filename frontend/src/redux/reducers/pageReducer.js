import { TYPES } from "../actions/pageAction";

const {
  LIST_PAGE_REQUEST_SEND,
  LIST_PAGE_REQUEST_ERROR,
  LIST_PAGE_REQUEST_SUCCESS,

  CREATE_PAGE_REQUEST,
  CREATE_PAGE_ERROR,
  CREATE_PAGE_SUCCESS,

  DELETE_PAGE_REQUEST,
  DELETE_PAGE_SUCCESS,
  DELETE_PAGE_ERROR,
} = TYPES;

const initialState = {
  listPageLoading: false,
  listPageError: "",
  pages: [],
  createPageError: "",
  createPageLoading: false,
};

const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case LIST_PAGE_REQUEST_SEND:
      return { ...state, listPageLoading: true, listPageError: "" };
    case LIST_PAGE_REQUEST_ERROR:
      return { ...state, listPageLoading: false, listPageError: action.error };
    case LIST_PAGE_REQUEST_SUCCESS:
      return {
        ...state,
        listPageLoading: false,
        listPageError: "",
        pages: action.data,
      };

    case CREATE_PAGE_REQUEST:
      return { ...state, createPageError: "", createPageLoading: true };
    case CREATE_PAGE_ERROR:
      return {
        ...state,
        createPageError: action.data,
        createPageLoading: false,
      };
    case CREATE_PAGE_SUCCESS:
      return { ...state, createPageError: "", createPageLoading: false,  pages: [...state.pages, action.data]};
    
      case DELETE_PAGE_REQUEST:
        return { ...state, deletePageError: "", deletePageLoading: true };
      case DELETE_PAGE_ERROR:
        return {
          ...state,
          deletePageError: action.error,
          deletePageLoading: false,
        };
      case DELETE_PAGE_SUCCESS:
        return {
          ...state,
          deletePageError: "",
          deletePageLoading: false,
          // Filter out the deleted page from the pages array
          pages: state.pages.filter((page) => page._id !== action.pageId),
        };

    default:
      return state;
  }
};

export default pageReducer;
