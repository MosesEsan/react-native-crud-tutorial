import 'react-native-gesture-handler';

import React from 'react';

import {createServer} from "miragejs"
import AsyncStorage from '@react-native-async-storage/async-storage';

import Router from './app/router';

const STORAGE_KEY = "@trades";

if (window.server) {
    server.shutdown()
}

async function getTrades() {
    let trades = await AsyncStorage.getItem(STORAGE_KEY);
    trades = (trades !== null) ? JSON.parse(trades) : [];
    return trades;
}

window.server = createServer({
    routes() {
        this.get("/api/trade", async () => {
            try {
                let trades = await getTrades();
                return {trades}
            } catch (e) {
                return {success: false, message: e}
            }
        });

        this.post("/api/trade", async (schema, request) => {
            try {
                //get the trades array
                let trades = await getTrades();

                //get the new trade data
                let trade = JSON.parse(request.requestBody);

                //push the the new trade into the trades arra
                trades.push(trade);

                //update the storage
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trades));

                return {trade, message: 'Trade added successfully'};

            } catch (e) {
                return {success: false, message: e}
            }
        });

        this.put("/api/trade/:id", async (schema, request) => {
            try {
                //get the id
                let id = request.params.id;

                //get the trades array
                let trades = await getTrades();

                //get the updated trade data
                let trade = JSON.parse(request.requestBody);

                //Find the trade using the id, if found update the trade using its index
                const index = trades.findIndex((obj) => obj.id === id);
                if (index !== -1) trades[index] = {...trades[index], ...trade};

                //update the storage
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trades));

                return {trade, message: 'Trade updated successfully'};

            } catch (e) {
                return {success: false, message: e}
            }
        });

        this.del("/api/trade/:id", async (schema, request) => {
            try {
                //get the id
                let id = request.params.id;

                //get the trades array
                let trades = await getTrades();

                //Find the trade using the id and remove it from the trades array
                trades = trades.filter((obj) => obj.id !== id);

                //update the storage
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trades));

                return {message: 'Trade deleted successfully'};

            } catch (e) {
                return {success: false, message: e}
            }
        })
    },
});

export default function App() {
    return (
        <Router/>
    );
}