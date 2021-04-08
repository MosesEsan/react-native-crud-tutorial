//ACTION TYPES
export const FETCH_REQUEST = 'FETCH_REQUEST';
export const CRUD_REQUEST = 'CRUD_REQUEST';

//FETCH REQUEST STATES
export const FETCH_STATE = {
    INITIAL: 'INITIAL',
    REFRESH: 'REFRESH',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS'
};

export const CRUD_STATE = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
};

//====
//INITIAL STATE
export const initialState = {
    isFetching: true,
    isRefreshing: false,
    error: null,
    data: []
};

//HANDLERS
export default function crudReducer (state = initialState, action) {
    switch (action.type) {
        case FETCH_REQUEST:{
            let [...data] = state.data;
            let fetchState = action.fetchState;

            //REQUEST STATE
            let isFetching = (fetchState === FETCH_STATE.INITIAL);
            let isRefreshing = (fetchState === FETCH_STATE.REFRESH);
            let requestState = {isFetching, isRefreshing};

            //DATA STATE
            let newState = {};
            if (fetchState === FETCH_STATE.ERROR) newState = {error: action.error};
            else if (fetchState === FETCH_STATE.SUCCESS) newState = {data: action.data, error:null};

            return {...state, ...requestState, ...newState};
        }

        case CRUD_REQUEST:{
            let [...data] = state.data;
            let newData  = action.data || null;
            let crudState = action.crudState;

            if (crudState === CRUD_STATE.CREATE) data.unshift(newData);
            else if (crudState === CRUD_STATE.UPDATE) {
                const index = data.findIndex((obj) => obj.id === newData.id);
                if (index !== -1) data[index] = {...data[index], ...newData};
            }else if (crudState === CRUD_STATE.DELETE) {
                let id  = action.id;
                data = data.filter((obj) => obj.id !== id);
            }

            return {...state, data};
        }

        default:
            return state;
    }
};