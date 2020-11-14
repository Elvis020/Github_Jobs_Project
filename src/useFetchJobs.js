import { useReducer, useEffect } from "react";
import Axios from "axios";

// Seting up types to help spot errors
const ACTIONS = {
  MAKE_REQUEST: "make_request",
  GET_DATA: "get-data",
  ERROR: "error",
  UPDATE_NEXT_PAGE: "update-next-page",
};

// Setting up reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] };
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs };
    case ACTIONS.ERROR:
      return { ...state, error: true, jobs: action.payload.error };
    case ACTIONS.UPDATE_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage };
    default:
      return state;
  }
};

// API for fetching github jobs and adding cors anywhere to help us with cors
const apiUrl = "https://api.allorigins.win/raw?url=https://jobs.github.com/positions.json";

export default function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  useEffect(() => {
    const cancelToken1 = Axios.CancelToken.source(); //Being able to cancel the token request
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    Axios.get(apiUrl, {
      cancelToken: cancelToken1.token,
      params: { ...params, page: page, markdown: true },
    })
      .then((res) => {
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
      })
      .catch((e) => {
        if (Axios.isCancel(e)) return; // If Axios request is cancelled it should return a silent error
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });

    const cancelToken2 = Axios.CancelToken.source(); //Being able to cancel the token request
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    Axios.get(apiUrl, {
      cancelToken: cancelToken2.token,
      params: { ...params, page: page + 1, markdown: true },
    })
      .then((res) => {
        dispatch({ type: ACTIONS.UPDATE_NEXT_PAGE, payload: { hasNextPage: res.data.length !== 0 } });
      })
      .catch((e) => {
        if (Axios.isCancel(e)) return; // If Axios request is cancelled it should return a silent error
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });
    return () => {
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);
  return state;
}
