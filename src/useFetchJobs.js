import {useReducer, useEffect} from 'react';
import Axios from 'axios';

// Seting up types to help spot errors
const ACTIONS ={
    MAKE_REQUEST: 'make_request',
    GET_DATA: 'get-data',
    ERROR: 'error'
}



// Setting up reducer function
const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.MAKE_REQUEST:
          return {loading: true, jobs:[]}
      case ACTIONS.GET_DATA:
          return {...state, loading: false, jobs: action.payload.jobs}
      case ACTIONS.ERROR:
          return {...state, error: true, jobs: action.payload.error}
      default:
        return state;
    }
}

// API for fetching github jobs and adding cors anywhere to help us with cors
// const apiUrl = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';
const apiUrl = "https://api.allorigins.win/raw?url=https://jobs.github.com/positions.json";
//localhost:8010/proxy
// const apiUrl = "http://locahost:8010/proxy/positions.json";

export default function useFetchJobs(params, page){
    const [state,dispatch]  = useReducer(reducer,{jobs: [], loading: true})

    useEffect(() => {
        const cancelToken = Axios.CancelToken.source(); //Being able to cancel the token request
        dispatch({ type: ACTIONS.MAKE_REQUEST });
        Axios.get(apiUrl, {
            cancelToken: cancelToken.token, 
            params:{...params, page:page,markdown:true}})
            .then(res => {
                dispatch({type: ACTIONS.GET_DATA, payload:{jobs: res.data}})
            })
            .catch((e) => {
                if(Axios.isCancel(e)) return // If Axios request is cancelled it should return a silent error
                dispatch({type: ACTIONS.ERROR, payload:{error: e}})
            })
        return () => {
            cancelToken.cancel();
        }
    }, [params,page])
    return state;
}