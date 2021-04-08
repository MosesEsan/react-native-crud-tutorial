import React, {useEffect, useMemo, useState, useContext} from 'react';
import {Button, View} from "react-native";

import Form, {TYPES} from 'react-native-basic-form';
import {Header} from 'react-native-elements';
import {showErrorAlert, showSuccessAlert} from 'mesan-react-native-components/utils'

import {useHome} from "../provider";
import {createUpdateTrade} from "../service";

export let headerTitleStyle = {fontWeight: 'bold', fontSize: 17, color: '#363434'};

export default function AddEditEvent(props) {
    const {navigation, route} = props;

    //1 - DECLARE VARIABLES
    const [edit, setEdit] = useState(false);
    const [trade, setTrade] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const {crud} = useHome();
    //==================================================================================================

    //2 - MAIN CODE BEGINS HERE
    useEffect(() => {
        if (route.params){
            let id = route.params.id || null;
            let trade = id ? crud.read(id) : null;
        }
        setEdit(!!trade);
        setTrade(trade);
    }, []);

    //==================================================================================================

    //4 - ON SUBMIT
    async function onSubmit(data) {
        setLoading(true);

        let title = !trade ? "Trade Added Successfully." : "Trade Updated Successfully.";
        let opt = null;

        if (edit) opt = trade['id'];
        else data['id'] = Math.random().toString(36).substr(2, 9);//if not in edit mode, generate an id

        try {
            let response = await createUpdateTrade(data, opt);

            if (edit) crud.update(response.trade);
            else crud.create(response.trade);

            setLoading(false);

            showSuccessAlert(response.message, title, () => navigation.pop());

        } catch (error) {
            showErrorAlert(error.message);
            setError(error.message);
            setLoading(false)
        }
    }

    //==================================================================================================


    // 6 - FORM PROPS
    //Form fields
    const fields = useMemo(() => (
        [
            {name: 'ticker', label: 'Ticker Symbol', required: true},
            {name: 'quantity', label: 'Quantity', required: true, type: TYPES.Number},
            [
                {name: 'entry', label: 'Entry Price', required: true, type: TYPES.Number},
                {name: 'exit', label: 'Exit Price', required: true, type: TYPES.Number}
            ],
            {name: 'notes', label: 'Notes', required: true, multiline: true}
        ]
    ), []);

    //==================================================================================================

    //7 - RENDER
    let title = !trade ? 'Create Trade' : 'Update Trade';
    return (
        <View style={{flex: 1}}>
            <Header
                backgroundColor={"#fff"}
                leftComponent={<Button onPress={() => navigation.pop()} title="Cancel" color={'#007AFF'}/>}
                centerComponent={{text: title, style: headerTitleStyle}}/>
            <Form
                fields={fields}
                initialData={trade}
                loading={loading}
                title={title}
                error={error}
                onSubmit={onSubmit}
                buttonStyle={{backgroundColor: "#5070FE"}}
                style={{backgroundColor: "white", paddingHorizontal: 16}}/>
        </View>
    );
};