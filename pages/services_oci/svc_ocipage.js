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
const OCIMain = (props) => {
    const [ticketData, setTicketData] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(0);

    return (
        <Stack.Navigator>
            <Stack.Screen name="OCS Tickets Menu">
                {props2 => props.userData != null ?
                    <OCIHome
                        {...props2}
                        userData={props.userData}
                        cb_setTicketData={setTicketData}
                        cb_selectTicket={setSelectedTicket}
                        ticketData={ticketData} />
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Ionicons name='person-add-outline' size={100} color='gray' />
                        <Text style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>
                            You have to be logged in with your ZRC account to access the Online Clinic System!
                        </Text>
                        <Text>
                            Go to the settings page to log in
                        </Text>
                    </View>
                }
            </Stack.Screen>
            <Stack.Screen name="Viewing Ticket">
                {props2 => <TicketViewer {...props2} userData={props.userData} ticketData={ticketData[selectedTicket]} />}
            </Stack.Screen>
            <Stack.Screen name="Ticket Request Form">
                {props2 => <FileTicketForm {...props2} userData={props.userData} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};
export default OCIMain;

const OCIHome = (props) => {
    const [ticketsLoaded, setTicketsLoaded] = useState(false);
    const [loadingFailed, setFail] = useState(false);

    const styles = StyleSheet.create({
        button: {
            margin: 5, padding: 15,
            borderRadius: 15,

            backgroundColor: 'gray',

            flexDirection: 'row',

            justifyContent: 'left',
            alignItems: 'center'
        },
        fileButton: {
            margin: 10,

            backgroundColor: '#ff6347',

            justifyContent: 'center',
            alignItems: 'center'
        },
        buttonLabel: {
            color: 'white',

            fontWeight: 'bold',
            fontSize: 20,

            margin: 5
        },
        regularLabel: {
            color: 'white',
            margin: 5,
            fontWeight: 'bold'
        },
        headingText: {
            textAlign: 'center',
            fontSize: 15,
        }
    });

    const fetchTickets = async () => {
        try {
            const unsub = onSnapshot(
                collection(firestore, 'tickets/' + props.userData.user.id + '/filed-tickets'),
                (qSnap) => {
                    const data = qSnap.docs.map((doc) => ({
                        ...doc.data(), id: doc.id
                    }));
                    props.cb_setTicketData(data);
                    setTicketsLoaded(true);
                }
            );

            return unsub;
        } catch (err) {
            console.error(err);
            Alert.alert("Failed to fetch your tickets! Do you have a stable internet connection?", err)
            setFail(true);            
        }
    };
    useEffect(() => {
        fetchTickets();
    }, []);

    const MainView = (props) => {
        let requestButtons_0 = [];
        let requestButtons_1 = [];
        let i = 0;
        props.tData.forEach(ticket => {
            if(ticket.verdict == 0 || ticket.verdict == 2) {
                requestButtons_0.push(
                    <RequestButton ticketData={ticket} nav={props.nav} cb_selectTicket={props.cb_selectTicket} key={ticket.id} id={i} verdict={ticket.verdict}/>
                );                
            } else {
                requestButtons_1.push(
                    <RequestButton ticketData={ticket} nav={props.nav} cb_selectTicket={props.cb_selectTicket} key={ticket.id} id={i} verdict={ticket.verdict}/>
                );  
            }
            i++;
        });
        requestButtons_0 = requestButtons_0.reverse();
        requestButtons_1 = requestButtons_1.reverse();
        requestButtons_0 = requestButtons_0.length == 0? <Text style={[styles.headingText, {margin: 10, fontWeight: 'bold'}]}>You have no tickets</Text> : requestButtons_0;
        requestButtons_1 = requestButtons_1.length == 0? <Text style={[styles.headingText, {margin: 10, fontWeight: 'bold'}]}>You have no tickets</Text> : requestButtons_1;

        return (
            <ScrollView style={{ height: '100%' }}>
                <TouchableOpacity onPress={async () => {
                    props.nav.navigate("Ticket Request Form");
                }}>
                    <View style={[styles.button, styles.fileButton]}>
                        <Ionicons name='add-circle' size={35} color={'white'} />
                        <Text style={styles.buttonLabel}>File a new ticket</Text>
                    </View>
                </TouchableOpacity>
                <ScrollView>
                    <View>
                        <Text style={styles.headingText}>My active tickets</Text>
                        <View>
                            {requestButtons_0}
                        </View>
                    </View>
                    <View>
                        <Text style={styles.headingText}>My closed tickets</Text>
                        <View>
                            {requestButtons_1}
                        </View>
                    </View>
                </ScrollView>
            </ScrollView>
        );
    };

    return (
        loadingFailed ? <FailScreen text={"Couldn't load your tickets, make sure you are logged in with an internet connection"} /> :
            ticketsLoaded ? <MainView tData={props.ticketData} nav={props.navigation} cb_selectTicket={props.cb_selectTicket} /> : <LoadingScreen text="Loading your tickets..." />
    );
};

const styles_shared_1 = StyleSheet.create({
    containerBox: {
        backgroundColor: 'gray',
        borderRadius: 15,

        padding: 15, margin: 10,

        justifyContent: 'center'
    },
    h1: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',

        marginBottom: 15
    },
    label: {
        color: 'white',
        textAlign: 'left',
        fontSize: 15,
    },
    manipContainer: {
        flexDirection: 'row'
    },
    manipButton: {
        borderRadius: 5,
        backgroundColor: '#b3b3b3',
        padding: 10, width: '40%', margin: '5%'
    },
    qtyInput: {
        backgroundColor: '#4a4a4a',
        padding: 5,
        borderRadius: 5,
        color: 'white',        
    },
    signStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    }
});

const RequestButton = (props) => {
    const styles = StyleSheet.create({
        redButton: {
            backgroundColor: '#ff5959'
        },
        greenButton: {
            backgroundColor: '#66b83d'
        },
        button: {
            margin: 5, padding: 15,
            borderRadius: 15,
    
            backgroundColor: 'gray',
    
            flexDirection: 'row',
    
            justifyContent: 'left',
            alignItems: 'center'
        },
        regularLabel: {
            color: 'white',
            margin: 5,
            fontWeight: 'bold'
        },        
    });    

    function onClicked() {
        props.cb_selectTicket(props.id);
        props.nav.navigate('Viewing Ticket');
    }

    const styleToUse = props.ticketData.verdict == 0 ? null : 
                        props.ticketData.verdict > 1 ? styles.greenButton : styles.redButton;
    const ioniconTouse = props.ticketData.verdict == 0 ? 'timer-outline' :
                            props.ticketData.verdict > 1 ? 'checkmark-outline' : 'close-outline'

    var claimReminder = props.ticketData.verdict == 2 ? " [Ready to be claimed]" : null;

    return (
        <TouchableOpacity onPress={onClicked}>
            <View style={[styles.button, styleToUse]}>
                <Ionicons name={ioniconTouse} size={30} color={'white'} />
                <Text style={styles.regularLabel}>Request #{props.ticketData.ticketID}{claimReminder}</Text>
            </View>
        </TouchableOpacity>
    );
};

const FileTicketForm = (props) => {
    const [dropdownData, setDDData] = useState([]);
    const [selectedID, setID] = useState({});
    const [selectedQuantity, setQty] = useState(1);
    const [remarks, setRmks] = useState("");

    const dropDownStyles = StyleSheet.create({
        dropdown: {
            backgroundColor: '#4a4a4a',
            borderRadius: 5,
            padding: 5
        },
        selected: {
            color: 'white',
            fontWeight: 'bold'
        },
        placeholder: {
            color: 'white',            
        }
    });

    const fetchDropdownData = async () => {
        await getDocs(collection(firestore, 'item_names'))
        .then(qSnap => {
            const datas = qSnap.docs.map((dSnap) => {
                return { name: dSnap.data().name,
                         value: dSnap.data().id,
                         maxOrderQty: dSnap.data().maxOrderQty }
            });

            setDDData(datas);              
        });
    };
    useEffect(()=> {
        fetchDropdownData();
    }, []);

    const submitTicket = async (_itemID, _itemQty, _maxQty, _rmk, _uData) => {        
        if(_itemID == null) {
            Alert.alert("Please select an item...");
            return false;
        }

        if(_itemQty > _maxQty) {
            Alert.alert("You are ordering too many items!");
            return false;
        }

        try {
            const ticketNumber = [...Math.floor(new Date() / 1000).toString(16).toUpperCase()].reverse().join("");
            await setDoc(doc(firestore, 'tickets/', _uData.user.id), {
                uid:  _uData.user.id,
                name: _uData.displayName
            });

            await setDoc(doc(firestore, 'tickets/' + _uData.user.id + '/filed-tickets/', ticketNumber), {
                dateFiled: Timestamp.fromDate(new Date()),
                dateResolved: Timestamp.fromDate(new Date(0)),
                rejectReason: "",
                acceptNotes: "",
                remarks: _rmk,
                requestedItem_id: _itemID,
                requestedItem_qty: _itemQty,
                resolver: "",
                ticketID: ticketNumber,
                verdict: 0
            });

            return true;
        } catch(err) {
            console.error(err);
            Alert.alert("Error submitting your ticket", err.toString());
        }       
    };

    return (
        <View>
            <View style={styles_shared_1.containerBox}>
                <Text style={styles_shared_1.h1}>File a request</Text>
                <Text style={[styles_shared_1.h1, { fontSize: 20 }]}>Select an item:</Text>
                <Dropdown
                data={dropdownData}
                style={dropDownStyles.dropdown}
                selectedTextStyle={dropDownStyles.selected}
                placeholderStyle={dropDownStyles.placeholder}
                containerStyle={dropDownStyles.dropdown}
                itemTextStyle={dropDownStyles.placeholder}
                itemContainerStyle={dropDownStyles.placeholder}
                search
                maxHeight={300}
                labelField='name'
                valueField='value'
                placeholder='Select item'
                searchPlaceholder='Search...'
                value={selectedID}
                onChange={item=> {
                    setID(item);                    
                }}
                renderLeftIcon={()=> {
                    <Ionicons name='pricetag-outline' size={35} color={'white'} />
                }}/>
                <Text style={[styles_shared_1.h1, { fontSize: 20 }]}>Quantity:</Text>                               
                <TextInput
                style={styles_shared_1.qtyInput}
                value={ selectedQuantity.toString()}
                keyboardType='numeric'
                onChangeText={(e) =>{
                    setQty(e);
                }}
                />
                <View style={styles_shared_1.manipContainer}>
                    <TouchableOpacity 
                    onPress={()=> {                                             
                        if(parseInt(selectedQuantity) < selectedID.maxOrderQty) {
                            setQty(selectedQuantity + 1);
                        }                       
                    }}
                    style={styles_shared_1.manipButton}>
                        <Text style={styles_shared_1.signStyle}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=> {
                        if(selectedQuantity > 1) {
                            setQty(parseInt(selectedQuantity) - 1);
                        }                        
                    }}
                    style={styles_shared_1.manipButton}>
                        <Text style={styles_shared_1.signStyle}>-</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles_shared_1.h1, { fontSize: 20 }]}>Additional Notes:</Text>                               
                <TextInput
                style={styles_shared_1.qtyInput}
                value={ remarks }                
                onChangeText={(e) =>{
                    setRmks(e);
                }}/>
            </View>

            <TouchableOpacity onPress={ () => {
                if(submitTicket(selectedID.value, selectedQuantity, selectedID.maxOrderQty, remarks, props.userData)) {
                    props.navigation.navigate('OCS Tickets Menu');
                }
            }}>
                <View style={styles_shared_1.containerBox}>
                    <Text style={[styles_shared_1.h1, { marginBottom: 0 }]}>Submit</Text>
                </View>
            </TouchableOpacity>            
        </View>
    );
};