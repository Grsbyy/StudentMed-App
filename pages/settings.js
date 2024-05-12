import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button } from 'react-native';
import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import firestore from '../services/firebase';

import '../global';

const Stack = createStackNavigator();
const SettingsPage = (props) => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Settings and Accounts">
                {() => <SettingsIndex loginCallback={props.loginCallback} adminCallback={props.adminCallback} userData={props.userData}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
};
export default SettingsPage;

const SettingsIndex = (props) => {    
    return(
        <ScrollView style={{height: '100%'}}>
            <ProfileManager {...props} loginCallback={props.loginCallback} adminCallback={props.adminCallback} userData={props.userData}/>
        </ScrollView>
    );
}

const ProfileManager = (props) => {
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
    
    async function googleLogin(cb, cb2) {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();            

            userInfo.displayName =
                userInfo.user.familyName != null ?
                userInfo.user.givenName + " " + userInfo.user.familyName
                :
                userInfo.user.givenName;

            const credential = auth.GoogleAuthProvider.credential(
                userInfo.idToken
            );
            await auth().signInWithCredential(credential)            

            cb(userInfo);
            setLoggedIn(true);

            console.log("Logged in for ID: " + userInfo.user.id);
            console.log("Will now check if admin...");

            getDocs(query(
                collection(firestore, 'users'),
                where('uid', '==', userInfo.user.id)
            )).then(qSnap => {
                qSnap.forEach(dSnap=> {
                    if(dSnap.data().isAdmin) {
                        cb2(true);
                        console.log("isAdmin");
                    }
                });
            });

            setDoc(
                doc(firestore, 'users', userInfo.user.id), {
                    display_name: userInfo.displayName,
                    email: userInfo.user.email,
                    uid: userInfo.user.id
                }, {merge: true}
            );
            
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
            Alert.alert('Failed to login', error.toString() + " Stack: " + error.stack);         
        }
    };

    async function googleSignout(cb, cb2) {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();            

            setLoggedIn(false);
            cb(null);
            cb2(false);            
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
                            () => googleSignout(props.loginCallback,  props.adminCallback)
                        }
                        color={'#ff6347'}/>
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
                    () => googleLogin(props.loginCallback, props.adminCallback)
                }
                disabled={isLoggedIn}
                />
            </View>
        );
    };    

    return(
        isLoggedIn ? <ProfileSection_loggedIn {...props} /> : <ProfileSection_loggedOut {...props}/>
    )
}