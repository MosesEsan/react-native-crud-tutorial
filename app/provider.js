import React, {useMemo, useContext, useReducer, createContext} from 'react';

//IMPORT REDUCER, INITIAL STATE AND ACTION TYPES
import crudReducer, {CRUD_REQUEST, CRUD_STATE, FETCH_REQUEST, FETCH_STATE, initialState} from "./reducer"

// CONTEXT ===================================
const HomeContext = createContext();

function HomeProvider(props) {
    const [state, dispatch] = useReducer(crudReducer, initialState || {});

    const fetch = async (apiRequest, refresh = false, dataKey = "data") => {
        let fetchState = refresh ? FETCH_STATE.REFRESH : FETCH_STATE.INITIAL;

        dispatch({type: FETCH_REQUEST, fetchState});
        try {
            let response = await apiRequest();
            let data = response[dataKey];
            dispatch({type: FETCH_REQUEST, fetchState: FETCH_STATE.SUCCESS, data: data})
        } catch (error) {
            dispatch({type: FETCH_REQUEST, fetchState: FETCH_STATE.ERROR, error})
        }
    };

    //2 - CRUD Operations
    const read = (id) => {
        let index = state.data.findIndex((obj) => obj.id === id);
        return (index !== -1)  ? state.data[index]: null;
    };

    const crud = {
        create: (data) => dispatch({type: CRUD_REQUEST, crudState: CRUD_STATE.CREATE, data}),
        read:read,
        update: (data) => dispatch({type: CRUD_REQUEST, crudState: CRUD_STATE.UPDATE, data}),
        delete: (id) => dispatch({type: CRUD_REQUEST, crudState: CRUD_STATE.DELETE, id:id})
    };

    const value = useMemo(() => {
        return {state, dispatch, fetch, crud};
    }, [state]);

    return (
        <HomeContext.Provider value={value}>
            {props.children}
        </HomeContext.Provider>
    );
}

const useHome = () => useContext(HomeContext);
export { HomeContext, useHome }
export default HomeProvider;