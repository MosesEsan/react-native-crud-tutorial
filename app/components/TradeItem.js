import React from 'react';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';

import SwipeableRow from "./SwipeableRow";

export default function TradeItem(props) {
    let showControls = props.onEdit || props.onDelete;

    if (showControls) return(
        <SwipeableRow onEdit={props.onEdit} onDelete={props.onDelete}>
            <Component {...props} style={styles.wrapper}/>
        </SwipeableRow>
    );
    else return <Component {...props} style={styles.wrapper}/>
}

TradeItem.defaultProps = {
    trade: null,
    onPress: null,

    onEdit: null,
    onDelete: null
};


export function Component(props) {
    const {trade, onPress, style} = props;

    return (
        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={{flex: 1}} onPress={onPress}>
            <View style={style}>
                <Text>{trade.ticker}</Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 8* 2,
        backgroundColor: "#FFF",
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor:"#ccc",
    }
});