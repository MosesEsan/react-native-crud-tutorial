import React, {useEffect, useState} from 'react';
import {FlatList, Text, StyleSheet, TouchableHighlight} from 'react-native';

import {Empty, Placeholder, OverlayContainer} from 'mesan-react-native-components'
import {showSuccessAlert, showErrorAlert} from 'mesan-react-native-components/utils'

import TradeItem from "../components/TradeItem";

import {useHome} from "../provider.js";
import {getTrades, deleteTrade} from "../service";

export default function HomeList(props) {
    const {navigation} = props;
    const {navigate} = navigation;

    //1 - DECLARE VARIABLES
    const [modalVisible, setModalVisible] = useState(false); //**
    const [statusMessage, setStatusMessage] = useState(""); //**

    const { state, fetch, crud} = useHome();
    let {isFetching, isRefreshing, error, data} = state;

    //==================================================================================================

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => {
        getData()
    }, []);

    //==================================================================================================

    //3 - GET DATA
    function getData(refresh = false) {
        let apiRequest = () => getTrades();
        fetch(apiRequest, refresh, "trades");
    }

    let onRefresh = () => getData(true);

    //==================================================================================================

    //4a - ON CREATE
    const onCreateTrade = () => navigate('AddEdit');

    //4b - ON EDIT
    const onEditTrade = (trade) => navigate('AddEdit', {id: trade['id']});

    //4c - ON DELETE
    async function onDeleteTrade(trade) {
        setStatusMessage("Deleting Trade....");
        setModalVisible(true);

        try {
            await deleteTrade(trade['id']);

            setModalVisible(false); setStatusMessage("");

            crud.delete(trade);

            setTimeout(() => showSuccessAlert("The Trade has been deleted successfully.", 'Trade Deleted'), 200)

        } catch (error) {
            setModalVisible(false);

            setStatusMessage("");

            setTimeout(() => showErrorAlert(error.message), 200)
        }
    }

    //==================================================================================================

    //FLATLIST ITEMS RENDERING
    //5a - RENDER ITEM
    const renderItem = (props) => {
        let {item} = props;

        // let onPress = () => navigate("TradeDetails", {id: item['id']});
        let onEdit = () => onEditTrade(item);
        let onDelete = () => onDeleteTrade(item);

        return (<TradeItem trade={item} onEdit={onEdit} onDelete={onDelete}/>)// onPress={onPress}
    };

    //5b - RENDER EMPTY
    const renderEmpty = () => {
        return <Empty message={"There are no trades available."}/>
    };

    //==================================================================================================

    // 6 - FLATLIST PROPS
    const keyExtractor = (item, index) => `trade_${item['id'].toString()}${index.toString()}`;
    const refreshProps = {refreshing: isRefreshing, onRefresh};

    //==================================================================================================

    //7 - RENDER VIEW
    if (isFetching || error) return <Placeholder isFetching={isFetching} error={error} onRetry={getData}/>;

    return (
        <OverlayContainer message={statusMessage} modalVisible={modalVisible}>
            <FlatList
                data={data}
                extraData={state}
                initialNumToRender={5}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                style={{backgroundColor: "#ffffff"}}
                contentContainerStyle={{minHeight: '100%'}}
                keyExtractor={keyExtractor}
                {...refreshProps}/>

            <TouchableHighlight style={styles.floatingButton} underlayColor='#ff7043' onPress={onCreateTrade}>
                <Text style={{fontSize: 25, color: 'white'}}>+</Text>
            </TouchableHighlight>
        </OverlayContainer>
    );
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F5F5F5'
    },

    activityIndicatorContainer:{
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    floatingButton:{
        backgroundColor: '#6B9EFA',
        borderColor: '#6B9EFA',
        height: 55,
        width: 55,
        borderRadius: 55 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 60,
        right: 15,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0
        }
    }
});