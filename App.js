import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'

import AnnouncementPage from './pages/announcements';
import KnowledgeBasePage from './pages/knowledgebase';

import Ionicons from 'react-native-vector-icons/Ionicons';

const AnnouncementsScreen = () => {
    return(
        <AnnouncementPage/>
    );
};

const KnowledgeBaseScreen = () => {
    return(
        <KnowledgeBasePage/>
    );
};

const ToolsScreen = () => {
    return(
        <View>
            <Text>This is the ToolsScreen!</Text>
        </View>
    );
};

const SettingsScreen = () => {
    return(
        <View>
            <Text>This is the SettingsScreen!</Text>
        </View>
    );
};

const Tab = createBottomTabNavigator();
const MainApp = () => {
    return(
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
                <Tab.Screen options={{headerShown:false}} name="Announcements" component={AnnouncementsScreen}/>
                <Tab.Screen options={{headerShown:false}} name="KB" component={KnowledgeBaseScreen}/>
                <Tab.Screen name="Services" component={ToolsScreen}/>
                <Tab.Screen name="Settings" component={SettingsScreen}/>
            </Tab.Navigator>
        </NavigationContainer>                
    );
};
export default MainApp;