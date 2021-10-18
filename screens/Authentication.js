import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import Logo from '../memory.png'

export default function Authentication(props) {
    return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.h1}>MemoryBox</Text>
            <Text style={styles.h2}>Social platform where memories are shared</Text>
          </View>
          <View style={styles.middleContainer}>
            <Image source={Logo} style={styles.images} />
          </View>
          <View style={styles.bottomContainer} >
            <GoogleSigninButton onPress={props.onGoogleButtonPress} />
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#000',
    alignItems: 'center',
    width: '100%',
  },
  h1: {
    color: '#008F68',
    fontSize: 40,
  },
  h2: {
    color: '#FAE042',
    fontSize: 18,
    marginTop: 8,
  },
  image: {
    width: 300,
    height: 260,
    justifyContent: 'center',
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomContainer: {
    justifyContent: 'center',
    width: '90%',
    marginLeft: 150,
    marginBottom: 100,
    padding: 10,
  },
});