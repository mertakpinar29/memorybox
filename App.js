import React, {useState, useEffect} from 'react'
import { View, Text } from 'react-native'
import auth from '@react-native-firebase/auth'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome';

import Authentication from './screens/Authentication'
import Authenticated from './screens/Authenticated';
import HomeScreen from './screens/HomeScreen'
import CreateScreen from './screens/CreateScreen'
import EditScreen from './screens/EditScreen';

const Tab = createBottomTabNavigator()


export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  GoogleSignin.configure({
    webClientId: 'YOUR CLIENT ID'
  })

  async function onGoogleButtonPress(){
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }

  auth().onAuthStateChanged((user) => {
    if(user) {
      console.log(user)
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
  })

  if(authenticated) {
    return (
      <NavigationContainer>
        <Tab.Navigator
        initialRouteName='Home'
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
        >
          <Tab.Screen name='Home' component={HomeScreen} options={{
            tabBarLabel:'Home',
            tabBarIcon: ({color,size}) => (
              <Icon name='home' color={color} size={size} />
            )
          }}
          />
          <Tab.Screen name='Profile' component={Authenticated} options={{
            tabBarLabel:'Profile',
            tabBarIcon: ({color,size}) => (
              <Icon name='user' color={color} size={size} />
            )
          }}
          />
           <Tab.Screen name='Create' component={CreateScreen} options={{
            tabBarLabel:'Create Memory',
            tabBarIcon: ({color,size}) => (
              <Icon name='pencil' color={color} size={size} />
            )
          }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    )
  }

  return <Authentication onGoogleButtonPress={onGoogleButtonPress} />
}
