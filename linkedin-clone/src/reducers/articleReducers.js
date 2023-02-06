import { SET_LOADING_STATUS, GET_ARTCILES } from "../actions/actionType";

export const initState = {
  loading: false,
  articles: [],
};
const articleReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADING_STATUS:
      return {
        ...state,
        loading: action.status,
      };
    case GET_ARTCILES:
      console.log("Entered article reducer", action.payload);
      return { ...state, articles: action.payload };
    default:
      return state;
  }
};

export default articleReducer;
