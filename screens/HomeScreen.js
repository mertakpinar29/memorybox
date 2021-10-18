import React, { useState, useEffect} from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Feed from './Feed';
import EditScreen from './EditScreen';

export default function HomeScreen({navigation}) {
    const Stack = createStackNavigator()
    return(
            <Stack.Navigator initialRouteName='Feed' screenOptions={{headerShown: false}}>
                <Stack.Screen name='Feed' component={Feed} />
                <Stack.Screen name='Edit' component={EditScreen} />
            </Stack.Navigator>
    )
}
