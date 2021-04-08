import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './scenes/Home';
import AddEditScreen from './scenes/AddEdit';

import HomeProvider from "./provider";

const Stack = createStackNavigator();

export default function App() {
    return (
        <HomeProvider>
            <NavigationContainer>
                <Stack.Navigator mode="modal">
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="AddEdit" component={AddEditScreen} options={{ headerShown: false }}/>
                </Stack.Navigator>
            </NavigationContainer>
        </HomeProvider>
    );
}