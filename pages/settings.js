import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button } from 'react-native';
import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const Stack = createStackNavigator();
const SettingsPage = (props) => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Settings and Accounts">
                {() => <SettingsIndex loginCallback={props.loginCallback} userData={props.userData}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
};
export default SettingsPage;

const SettingsIndex = (props) => {
    const [isLoggedIn, setLoggedIn] = useState(false); 
    const [, refresh] = useReducer(x => x + 1, 0);

    const styles = StyleSheet.create({
        loginWarn: {
            fontWeight: 'bold',
            textAlign: 'center'
        },
        profileSection1: {
            flexDirection: 'row',
            
            borderBottomColor: '#b3b3b3',
            borderBottomWidth: 2,

            padding: 15,

            margin: 10,
            backgroundColor: '#b3b3b3',
            borderRadius: 15,

            justifyContent: 'center'
        },        
        nameDisplay: {
            fontWeight: 'bold',
            margin: 5,

            fontSize: 20,

            textAlign:'center', 
            color: 'white'           
        },
        emailDisplay: {            
            fontSize: 15,

            margin: 5,

            textAlign:'center',
            color: 'rgb(200, 200, 200)'
        },
        profilePicture: {
            width: 100, height: 100,
            borderRadius: 50,

            borderColor: 'white',
            borderWidth: 2,

            marginRight: 10,
        },
        darken: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            width: '100%',
            height: '100%',

            padding: 15,
            flexDirection: 'column',            

            alignItems: 'center',            
        }
    });
    
    async function googleLogin(cb) {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            cb(userInfo);
            setLoggedIn(true);
        } catch(error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
              } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
              } else {
                // some other error happened
              }

            setLoggedIn(false);
            if(error.code !== statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Failed to login', error.toString() + " Stack: " + error.stack);
            }            
        }
    };

    async function googleSignout(cb) {
        try {
            const userInfo = await GoogleSignin.signOut();            

            setLoggedIn(false);
            cb(userInfo);            
            refresh();
        } catch(error) {            
            Alert.alert('Failed to logout', error.toString() + " Stack: " + error.stack);
        }
    };

    const ProfileSection_loggedIn = (props) => {
        return(
            <ImageBackground style={[styles.profileSection2]} src={props.userData.user.photo} blurRadius={1}>
                <View style={styles.darken}>
                    <Image
                    style={
                        styles.profilePicture
                    }
                    src={props.userData.user.photo}/>
                    <View>
                        <Text style={styles.nameDisplay}>
                        {props.userData.user.name}
                        </Text>
                        <Text style={styles.emailDisplay}>
                            {props.userData.user.email}
                        </Text>
                        <Button
                        title="Sign out"
                        onPress={
                            () => googleSignout(props.loginCallback)
                        }/>
                    </View>
                </View>                
            </ImageBackground> 
        );
    };

    const ProfileSection_loggedOut = (props) => {
        return(
            <View style={[styles.profileSection1, {flexDirection:'column'}]}>
                <Text style={styles.loginWarn}>You are not signed in.</Text>
                <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={
                    () => googleLogin(props.loginCallback)
                }
                disabled={isLoggedIn}
                />
            </View>
        );
    };    

    return(
        <ScrollView style={{height: '100%'}}>
        { 
            isLoggedIn ? <ProfileSection_loggedIn {...props} /> : <ProfileSection_loggedOut {...props}/>
        }                                
        </ScrollView>
    )
}