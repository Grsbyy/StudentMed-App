import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, SafeAreaView } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';

import AnnouncementPage from './pages/announcements';
import KnowledgeBasePage from './pages/knowledgebase';
import SettingsPage from './pages/settings';
import ServicesPage from './pages/services_screen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();
const MainApp = () => {
    const [loginData, setLoginData] = useState(null);

    useEffect(()=>{
        GoogleSignin.configure({
            webClientId: '539979970488-oaimua8od0km3urfrroe00hnpepntk2v.apps.googleusercontent.com',
        })
    },[]);

    return(
        <SafeAreaView style={{height: '100%'}}>
            <StatusBar
            animated={true}
            backgroundColor={'black'}
            hidden={false}/>
            <NavigationContainer>
                <Tab.Navigator
                screenOptions={({route}) => (
                    {
                        tabBarIcon: ({ focused, color, size}) => {
                            let iconName;

                            switch(route.name) {
                                case "Announcements":
                                    iconName = 'newspaper'
                                    break;
                                case "KB":
                                    iconName = 'book';
                                    break;
                                case "Services":
                                    iconName = 'medical'
                                    break;
                                case "Settings":
                                    iconName = 'settings'
                                    break;
                            }
                            
                            if(!focused) {
                                iconName += '-outline';
                            }                            

                            return <Ionicons name={iconName} size={size} color={color}/>
                        },
                        tabBarActiveTintColor: 'tomato',
                        tabBarInactiveTintColor: 'gray'
                    }
                )}>
                    <Tab.Screen options={{headerShown:false}} name="Announcements" children={
                        () => <AnnouncementPage/>
                    }/>
                    <Tab.Screen options={{headerShown:false}} name="KB" children={
                        () => <KnowledgeBasePage/>
                    }/>
                    <Tab.Screen options={{headerShown:false}} name="Services" children={
                        () => <ServicesPage userData={loginData}/>                    
                    }/>
                    <Tab.Screen options={{headerShown:false}} name="Settings" children={
                        ()=> <SettingsPage loginCallback={setLoginData} userData={loginData}/>
                    }/>
                </Tab.Navigator>
            </NavigationContainer> 
        </SafeAreaView>                       
    );
};
export default MainApp;