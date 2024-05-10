import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button, Switch } from 'react-native';
import FailScreen from './misc/fail_screen';
import LoadingScreen from './misc/loading_screen';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { Timestamp, addDoc, collection, doc, getDoc, getDocs, getFirestore, limitToLast, onSnapshot, query, refEqual, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import firestore from '../services/firebase';
import { Dropdown } from 'react-native-element-dropdown';

const Stack = createStackNavigator();
const OCIAdmin = (props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='OCS Admin menu'>
                {props2 =>
                    props.isAdmin ?
                        <OCIAdminMain/>
                        :
                        <FailScreen text="You must be admin to access this." />
                }
            </Stack.Screen>
        </Stack.Navigator>
    );
};
export default OCIAdmin;

const OCIAdminMain = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [onlyShowGreens, setShowGreen] = useState(false);
    const [ticketData, setTicketData] = useState([]);

    const styles = StyleSheet.create({
        searchBar: {
            padding: 10, marginBottom: 15,
            borderColor: 'gray', borderWidth: 2, borderRadius: 10
        },
        qrButton: {
            backgroundColor: '#ff6347',
            justifyContent: 'center',
            alignItems: 'center',

            padding: 15, borderRadius: 15, marginBottom: 15
        },
        ticketButton: {
            backgroundColor: 'gray',
            justifyContent: 'center',            

            padding: 15, borderRadius: 15, marginBottom: 15
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 20
        },
        headingText: {
            textAlign: 'center',
            fontWeight  : 'bold'
        }
    });

    const getTickets = async () => {
        try {
            onSnapshot(
                collection(firestore, '"filed-tickets"'),
                (qSnap) => {
                    qSnap.forEach((dSnap) => {
                        console.log(dSnap.data());
                    })
                }
            )
        } catch(err) {
            Alert.alert("Error on OCS ADMIN PAGE", err);
            console.error(err);
        }
    };
    useEffect(()=> {
        getTickets();
    }, []);

    const ticketPreviewButtons = [];        

    return (
        <View style={{height: '100%', padding: 10}}>
            <TouchableOpacity onPress={()=>{}}
            style={styles.qrButton}>
                <Text style={styles.buttonText}>Scan QR</Text>
            </TouchableOpacity>
            <TextInput
            style={styles.searchBar}
            value={searchTerm}
            onChangeText={(e) => {
                setSearchTerm(e)
            }}
            placeholder='Search name here...'/>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Text>Show accepted tickets</Text>
                <Switch 
                value={onlyShowGreens}
                onValueChange={(val)=>{
                    setShowGreen(val);
                }}/>
            </View>
            <Text style={[styles.headingText, {marginBottom: 10}]}>{ onlyShowGreens ? "Open tickets" : "Closed tickets" }</Text>    
            <ScrollView>
                <TouchableOpacity onPress={() => { }}
                    style={styles.ticketButton}>
                    <Text style={styles.buttonText}>Ticket #TICKET_NUMBER</Text>
                </TouchableOpacity>
            </ScrollView>    
        </View>
    );
};