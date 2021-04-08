import axios from 'axios';

//API End Point
export const TRADE = `/api/trade`;

//INDEX
export async function getTrades(){
    try{
        let res = await axios.get(`${TRADE}`);

        return res.data;
    }catch (e) {
        throw handler(e)
    }
}

//CREATE AND EDIT
export async function createUpdateTrade(data, id){
    try{
        const options = {
            method: !id ? 'POST' : 'PUT',
            headers: {Accept: "application/json",},
            data: data,
            url : id ? `${TRADE}/${id}` : `${TRADE}`
        };

        let res = await axios(options);
        return res.data;
    }catch (err) {
        throw err;
    }
}

//READ
export async function getTrade(id){
    try{
        let res = await axios.get(`${TRADE}/${id}`);

        return res.data;
    }catch (err) {
        throw err;
    }
}

//DELETE
export async function deleteTrade(id) {
    try {
        let res = await axios.delete(`${TRADE}/${id}`);

        return res.data;
    }catch (err) {
        throw err;
    }
}