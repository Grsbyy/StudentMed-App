import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button } from 'react-native';
import FailScreen from '../misc/fail_screen';
import LoadingScreen from '../misc/loading_screen';
import TicketViewer from '../misc/ticketviewer';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { Timestamp, addDoc, collection, doc, getDoc, getDocs, getFirestore, limitToLast, onSnapshot, query, refEqual, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import firestore from '../../services/firebase';
import { Dropdown } from 'react-native-element-dropdown';

const Stack = createStackNavigator();
const LFMain = (props) => {
    const [itemData, setItemData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(0);

    return(
        <Stack.Navigator>
            <Stack.Screen name='Lost and Found reporting system'>
                {props2 => props.userData != null ?
                    <LFHome />
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Ionicons name='person-add-outline' size={100} color='gray' />
                        <Text style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>
                            You have to be logged in with your ZRC account to access the LnFRS!
                        </Text>
                        <Text>
                            Go to the settings page to log in
                        </Text>
                    </View>
                }
            </Stack.Screen>            
        </Stack.Navigator>  
    );
}

const LFHome = (props) => {
    const [itemsLoaded, setItemsLoaded] = useState(false);
    
    const styles = StyleSheet.create({

    });
};