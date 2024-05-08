import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button } from 'react-native';
import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

// import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const Stack = createStackNavigator();
const SettingsPage = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Settings">
                {props => <SettingsIndex {...props}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
};
export default SettingsPage;

const SettingsIndex = (props) => {
    const [isLoggedIn, setLoggedIn] = useState(false);    

    const styles = StyleSheet.create({
        loginWarn: {
            fontWeight: 'bold',
            textAlign: 'center'
        },
        profileSection: {
            flexDirection: 'row',
            
            borderBottomColor: '#b3b3b3',
            borderBottomWidth: 2,

            padding: 15
        },
        nameDisplay: {
            fontWeight: 'bold'
        },
        profilePicture: {
            width: 80, height: 80,
            borderRadius: 40,

            marginRight: 10,
        }        
    });
    
    // const googleLogin = async() => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const userInfo = await GoogleSignin.signIn();

    //         this.setState({userInfo, error: undefined})
    //         setLoggedIn(true);
    //     } catch(error) {
    //         setLoggedIn(false);
    //     }
    // };

    return(
        <ScrollView style={{height: '100%'}}>
            {
                isLoggedIn ?                
                //Is logged in
                <View style={[styles.profileSection]}>
                    <Image
                    style={
                        styles.profilePicture
                    }
                    src='https://scontent.fdvo2-2.fna.fbcdn.net/v/t39.30808-6/438225197_1171051553914049_1298762820347665495_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qkzMrDs74VEQ7kNvgEicLHf&_nc_ht=scontent.fdvo2-2.fna&oh=00_AfAE2fxdGowOVp2IAhrj-xXp1DBegsGBE0oKNP-7hcU1Zw&oe=66409269'/>
                    <View>
                        <Text style={styles.nameDisplay}>
                            Anthony James G. Moran
                        </Text>
                        <Text>
                            agmoran@zrc.pshs.edu.ph
                        </Text>
                        <Button
                        title="Sign out"
                        onPress={
                            function() {
                                
                            }
                        }/>
                    </View>
                </View>
                :
                // Not logged in
                <View style={[styles.profileSection, {flexDirection:'column'}]}>
                    <Text style={styles.loginWarn}>You are not signed in.</Text>
                    {/* <Button
                    title="Click here to sign in."
                    onPress={
                        function() { googleLogin }
                    }/> */}
                    {/* <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={googleLogin}
                    disabled={this.state.isSigninInProgress}
                    /> */}
                </View> 
            }                                
        </ScrollView>
    )
}