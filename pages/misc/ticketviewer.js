import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button } from 'react-native';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, getFirestore, limitToLast, onSnapshot, query, refEqual, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import firestore from '../../services/firebase';
import QRCode from 'react-native-qrcode-svg';

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
const TicketViewer = (props) => {
    // 0 - Pending
    // 1 - Rejected
    // 2 - Accepted
    // 3 - Claimed

    const [fetchFailed, setFail] = useState(false);
    const [fetchDone, setDone] = useState(false);
    const [nameData, setNameData] = useState(props.ticketData.requestedItem_id);    

    const fetchItemNames = async () => {
        try {
            getDocs(query(
                collection(firestore, 'item_names'),
                where("id", "==", props.ticketData.requestedItem_id)
            )).then(qSnap => {
                qSnap.forEach(dSnap => {
                    setNameData(dSnap.data().name);
                });
            });
        } catch (err) {
            setFail(true);
            console.error(err);
        }
    };
    useEffect(() => {
        fetchItemNames();
    }, []);

    const claimTicket = async () => {
        try {
            await updateDoc(doc(firestore, 'tickets/' + props.userData.user.id + '/filed-tickets/', props.ticketData.ticketID), {                
                verdict: 3
            });
        } catch (err) {
            setFail(true);
            console.error(err);
        }
    };

    const VerdictBox = () => {
        switch (Number(props.ticketData.verdict)) {
            case 0:
                return (
                    <View style={[styles_shared_1.containerBox, { marginTop: 0 }]}>
                        <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>This request is pending approval.</Text>
                    </View>
                );
            case 1:
                return (
                    <View style={[styles_shared_1.containerBox, { marginTop: 0, backgroundColor: '#ff5959' }]}>
                        <Text style={[styles_shared_1.h1, { fontSize: 20 }]}>This request was denied.</Text>
                        <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Processed by</Text>
                        <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.resolver}</Text>
                        <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Processed on</Text>
                        <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.dateResolved.toDate().toLocaleString()}</Text>
                        <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Why was my request rejected?</Text>
                        <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.rejectReason}</Text>

                    </View>
                );
            case 2:
                return (
                    <View>
                        <View style={[styles_shared_1.containerBox, { marginTop: 0, backgroundColor: '#66b83d' }]}>
                            <Text style={[styles_shared_1.h1, { fontSize: 15 }]}>This request was approved, please visit the clinic nurse.</Text>
                            <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Processed by</Text>
                            <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.resolver}</Text>
                            <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Processed on</Text>
                            <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.dateResolved.toDate().toLocaleString()}</Text>
                            {props.ticketData.acceptNotes.length > 0 ?
                                <View>
                                    <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Additional notes:</Text>
                                    <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.acceptNotes}</Text>
                                </View>
                                : null}                            
                        </View>
                        {props.ociAdmin ?
                            null :
                            <TouchableOpacity onPress={() => { claimTicket() }}>
                                <View style={[styles_shared_1.containerBox, { marginTop: 0, backgroundColor: '#66b83d' }]}>
                                    <Text style={[styles_shared_1.h1, { marginBottom: 0 }]}>Close this ticket yourself</Text>
                                </View>
                            </TouchableOpacity>
                        }                        
                    </View>                    
                );
            case 3:
                return (
                    <View style={[styles_shared_1.containerBox, { marginTop: 0, backgroundColor: '#66b83d' }]}>
                        <Text style={[styles_shared_1.h1, {  fontSize: 15 }]}>This request was approved and now closed.</Text>
                        <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Processed by</Text>
                        <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.resolver}</Text>
                        <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Processed on</Text>
                        <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.dateResolved.toDate().toLocaleString()}</Text>
                        {props.ticketData.acceptNotes.length > 0 ?
                            <View>
                                <Text style={[styles_shared_1.h1, { marginBottom: 0, fontSize: 15 }]}>Additional notes:</Text>
                                <Text style={[styles_shared_1.label, { textAlign: 'center' }]}>{props.ticketData.acceptNotes}</Text>
                            </View>
                            : null}   
                    </View>
                );
        }
    };

    const AdditionalMessageSect = () => {
        if (props.ticketData.remarks.length > 0) {
            return (
                <Text style={styles_shared_1.label}>
                    <Text style={{ fontWeight: 'bold' }}>Additional message from sender: </Text>
                    <Text>{props.ticketData.remarks}</Text>
                </Text>
            );
        } else {
            return null;
        }
    };

    return (
        <ScrollView style={{height: '100%'}}>
            <View style={styles_shared_1.containerBox}>
                <Text style={styles_shared_1.h1}>Ticket #{props.ticketData.ticketID}</Text>
                <Text style={styles_shared_1.label}>
                    <Text style={{ fontWeight: 'bold' }}>Requested item: </Text>
                    <Text>{nameData}</Text>
                </Text>
                <Text style={styles_shared_1.label}>
                    <Text style={{ fontWeight: 'bold' }}>Requested quantity: </Text>
                    <Text>{props.ticketData.requestedItem_qty}</Text>
                </Text>
                <Text style={styles_shared_1.label}>
                    <Text style={{ fontWeight: 'bold' }}>Date filed: </Text>
                    <Text>{props.ticketData.dateFiled.toDate().toLocaleString()}</Text>
                </Text>
                <View style={{alignItems: 'center', padding: 25}}>
                    <QRCode                        
                        value={props.ticketData.ticketID}
                        size={200}
                        color='black'
                        backgroundColor='white'
                    />
                </View>                
                <AdditionalMessageSect />
            </View>
            <VerdictBox />
        </ScrollView>
    );
};
export default TicketViewer;