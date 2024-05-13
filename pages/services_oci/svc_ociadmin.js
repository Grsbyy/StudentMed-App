import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button, Switch } from 'react-native';
import FailScreen from '../misc/fail_screen';
import LoadingScreen from '../misc/loading_screen';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { Timestamp, addDoc, collection, doc, getDoc, getDocs, getFirestore, limitToLast, onSnapshot, query, refEqual, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import firestore from '../../services/firebase';
import { Dropdown } from 'react-native-element-dropdown';
import TicketViewer from '../misc/ticketviewer';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const Stack = createStackNavigator();
const OCIAdmin = (props) => {
    const [ticketData, setTicketData] = useState({});
    const [currentTicket, setCurrentTicket] = useState(null);

    if(props.isAdmin && props.userData != null) {
        return (
            <Stack.Navigator>
                <Stack.Screen name='OCS Admin menu'>
                    {props2 =>
                        <OCIAdminMain
                            setTicketData={setTicketData} ticketData={ticketData}
                            setCurrentTicket={setCurrentTicket}
                            nav={props2.navigation}/>
                    }
                </Stack.Screen>
                <Stack.Screen name='OCS Admin Viewing Ticket'>
                    { props2 =>
                        <TicketController
                        setCurrentTicket={setCurrentTicket}
                        ticketData={currentTicket}
                        userData={props.userData}
                        nav={props2.navigation}/>
                    }
                </Stack.Screen>
                <Stack.Screen name='QR Scan'>
                    { props2 =>
                        <QRScan
                        setCurrentTicket={setCurrentTicket}
                        ticketData={ticketData}                        
                        nav={props2.navigation}/>
                    }
                </Stack.Screen>
            </Stack.Navigator>
        );
    } else {
        return(
            <FailScreen text="You require admin privileges to access the OCS Admin"/>
        );
    }
};
export default OCIAdmin;

const styles_shared_1 = StyleSheet.create({
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
const OCIAdminMain = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [onlyShowDone, setShowOnlyDone] = useState(false);  
    const [isLoading, setLoading] = useState(true);
    const [names, addNames] = useState({});

    const getTicketsAndNames = async () => {
        try {            
            onSnapshot(
                collection(firestore, 'users'), (qSnap) => {
                    qSnap.forEach(dSnap => {
                        
                        const uid = dSnap.data().uid;
                        onSnapshot(
                            collection(firestore, 'tickets/' + uid + '/filed-tickets'),
                            (qSnap2) => {
                                qSnap2.forEach(dSnap2 => {                                    
                                    props.setTicketData(old => {                                        
                                        if([uid] in old) {      
                                            if(old[uid].length > qSnap2.size) {
                                                return {...old, [uid] : [{...dSnap2.data(), id:dSnap2.id, userID: uid }]};
                                            } else {
                                                if (old[uid].map(e => e.ticketID).includes(dSnap2.data().ticketID)) {
                                                    return {
                                                        ...old, [uid]:
                                                            [...old[uid].filter(e => e.ticketID != dSnap2.data().ticketID),
                                                            { ...dSnap2.data(), id: dSnap2.id, userID: uid }]
                                                    };
                                                } else {
                                                    return { ...old, [uid]: [...old[uid], { ...dSnap2.data(), id: dSnap2.id, userID: uid }] };
                                                }  
                                            }                                          
                                        } else {
                                            //New user                                            
                                            return {...old, [uid] : [{...dSnap2.data(), id:dSnap2.id, userID: uid }]};
                                        }                                        
                                    });
                                    setLoading(false);
                                });
                            }
                        );

                        addNames((old) => {                            
                            if(!([uid] in old)) {
                                return {...old, [uid]: dSnap.data().display_name}
                            } else {
                                return {...old};
                            }                       
                        });
                    });
                });                
        } catch(err) {
            Alert.alert("Error on OCS ADMIN PAGE", err);
            console.error(err);
        }
    };    
    useEffect(()=> {
        getTicketsAndNames();
    }, []);    

    const ticketData2 = []; 
    const ticketPreviewButtons = [];
    for(let [k, v] of Object.entries(props.ticketData)) {
        v.forEach(v2 => {
            ticketData2.push(v2);
        });          
    };        
    ticketData2.forEach(tData => {        
        if(searchTerm.length == 0 ||
            (searchTerm.length > 0 &&
                (names[tData.userID].toLowerCase().replaceAll(/\s+/g, '').includes(searchTerm.toLowerCase().replace(/\s+/g, ''))
            ||  (tData.ticketID.toLowerCase().includes(searchTerm.toLowerCase().replace(/\s+/g, '')))))) {
            if((tData.verdict == 0 && !onlyShowDone) || tData.verdict > 0 && onlyShowDone) {
                ticketPreviewButtons.push(
                    <PreviewTicketButton
                    key={tData.id}
                    ticketData={tData}
                    nav={props.nav}
                    setCurrentTicket={props.setCurrentTicket}
                    />            
                );
            }
        }        
    });

    return (
        <View style={{height: '100%', padding: 10}}>
            <TouchableOpacity onPress={()=>{
                props.nav.navigate('QR Scan');
            }}
            style={styles_shared_1.qrButton}>
                <Text style={styles_shared_1.buttonText}>Scan QR</Text>
            </TouchableOpacity>
            <TextInput
            style={styles_shared_1.searchBar}
            value={searchTerm}
            onChangeText={(e) => {
                setSearchTerm(e)
            }}
            placeholder='Search name or ticketID here...'/>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Text>Show accepted tickets</Text>
                <Switch 
                value={onlyShowDone}
                onValueChange={(val)=>{
                    setShowOnlyDone(val);
                }}/>
            </View>
            <Text style={[styles_shared_1.headingText, {marginBottom: 10}]}>{ onlyShowDone ? "Closed tickets" : "Open tickets" }</Text>    
            <ScrollView>
                { isLoading ? <LoadingScreen text={"Loading tickets..."}/> : ticketPreviewButtons }
            </ScrollView>             
        </View>
    );
};

const PreviewTicketButton = (props) => {
    const bgColor = () => {
        switch(props.ticketData.verdict) {
            case 0:
                return {};
            case 1:
                return {backgroundColor: '#ff5959'};
            case 2:
            case 3:
                return {backgroundColor: '#66b83d'};    
        }
    }

    return (
        <TouchableOpacity onPress={() => {
            props.setCurrentTicket(props.ticketData)
            props.nav.navigate("OCS Admin Viewing Ticket");            
        }}
            style={[styles_shared_1.ticketButton, 
                bgColor()
            ]}>
            <Text style={styles_shared_1.buttonText}>Ticket #{props.ticketData.ticketID}</Text>
        </TouchableOpacity>
    );
};

const TicketController = (props) => {
    const [displayName, setDisplayName] = useState(props.ticketData.userID);
    const [itemName, setItemName] = useState(props.ticketData.requestedItem_id);
    const [choosingVerdict, setChoosing] = useState(0); // 0 - None, 1 - Reject, 2 - Accept

    const fetchData = async () => {
        try {
            getDocs(query(
                collection(firestore, 'item_names'),
                where("id", "==", props.ticketData.requestedItem_id)
            )).then(qSnap => {
                qSnap.forEach(dSnap => {
                    setItemName(dSnap.data().name);
                });
            });

            getDocs(query(
                collection(firestore, 'users'),
                where('uid', '==', props.ticketData.userID)
            )).then(qSnap => {
                qSnap.forEach(dSnap=> {
                    setDisplayName(dSnap.data().display_name)
                });
            });
        } catch (err) {
            Alert.alert("Error fetching data for ticket display.", err);
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const styles = StyleSheet.create({
        headerBox: {
            backgroundColor: 'gray',
            justifyContent: 'center',

            padding: 15, margin: 10,
            borderRadius: 15
        },
        oneLine: {
            alignSelf: 'left',
            color: 'white',
            fontSize: 17.5
        },
        bolded: {
            fontWeight: 'bold'
        },
        button: {
            width: '45%',
            marginLeft: '2.5%',marginRight: '2.5%',
            backgroundColor: 'orange',
            padding: 10, margin: 5,
            borderRadius: 5,

            justifyContent: 'center'
        },
        button_Text: {
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold'
        },
        redButton: {
            backgroundColor: '#ff5959'
        },
        greenButton: {
            backgroundColor: '#66b83d'
        },
        formLabel: {
            color: 'white',
            fontWeight: 'bold'
        }, 
        textInput: {            
            color: 'white',
            padding: 10,
            borderRadius: 5,
            margin: 5
        },
        submitButton: {
            backgroundColor: 'white',
            color: 'black'
        }
    });

    const VerdictForm = () => {
        const [respondentName, setRespondentName] = useState(props.userData.displayName);
        const [remarks, setRemarks] = useState("");        

        const bgColor = () => {
            switch(choosingVerdict) {
                case 1:
                    return {backgroundColor: '#ff5959'};
                case 2:
                    return {backgroundColor: '#66b83d'};    
            }
        };
        const bgColorDarker = () => {
            switch(choosingVerdict) {
                case 1:
                    return {backgroundColor: '#c24242'};
                case 2:
                    return {backgroundColor: '#52962f'};    
            }
        };

        const SubmitVerdict = async () => {
            try {
                switch(choosingVerdict) {
                    case 1:
                        await setDoc(doc(firestore, 'tickets/' + props.ticketData.userID + '/filed-tickets/', props.ticketData.ticketID), {                
                            dateResolved: Timestamp.fromDate(new Date()),                
                            rejectReason: remarks,
                            resolver: respondentName,                        
                            verdict: 1
                        }, {merge: true});
                        break;
                    case 2:
                        await setDoc(doc(firestore, 'tickets/' + props.ticketData.userID + '/filed-tickets/', props.ticketData.ticketID), {                
                            dateResolved: Timestamp.fromDate(new Date()),                
                            acceptNotes: remarks,
                            resolver: respondentName,                        
                            verdict: 2
                        }, {merge: true});
                        break;
                }  
            } catch (err) {
                Alert.alert("There was an error submitting the verdict!", err);
                console.error(err);
            }
        };

        return(
            <View style={[styles.headerBox,
                bgColor()
            ]}>
                <Text style={styles.formLabel}>Processed by:</Text>
                <TextInput
                style={[styles.textInput, bgColorDarker()]}
                value={respondentName}
                onChangeText={e=>{
                    setRespondentName(e);
                }}
                />
                <Text style={styles.formLabel}>{ choosingVerdict == 1 ? "Reason for rejection" : "Additional notes to receiver"}:</Text>
                <TextInput
                style={[styles.textInput, bgColorDarker()]}
                value={remarks}
                onChangeText={e=>{
                    setRemarks(e);
                }}/>
                <TouchableOpacity style={[styles.button, styles.submitButton, {width: '95%'}]}
                onPress={()=>{
                    SubmitVerdict();                    
                    props.nav.navigate('OCS Admin menu');                    
                }}>
                    <Text style={[styles.button_Text, {color: 'black', fontSize: 20}]}>{ choosingVerdict == 1 ? "REJECT" : "ACCEPT"}</Text>
                </TouchableOpacity>
            </View>
        );        
    }

    const setDynaButtonColor = () => {
        switch(choosingVerdict) {
            case 1:
                return styles.redButton;
            case 2:
                return styles.greenButton;
        }
    }

    return(
        <View>
            <View style={styles.headerBox}>                
                <Text style={styles_shared_1.buttonText}>Ticket #{props.ticketData.ticketID}</Text>
                <Text style={styles.oneLine}><Text style={styles.bolded}>Filed by:</Text> {displayName}</Text>
                <Text style={styles.oneLine}><Text style={styles.bolded}>Date filed:</Text> {props.ticketData.dateFiled.toDate().toLocaleString()}</Text>
                <Text style={styles.oneLine}><Text style={styles.bolded}>Item requested:</Text> {itemName}</Text>
                <Text style={styles.oneLine}><Text style={styles.bolded}>Quantity requested:</Text> {props.ticketData.requestedItem_qty}</Text>
            </View>
            { props.ticketData.verdict > 0 ?
                <TicketViewer ociAdmin {...props} ticketData={props.ticketData}/>
            :
                <View style={styles.headerBox}>
                    <Text style={styles_shared_1.buttonText}>This ticket has not been resolved yet!</Text>                    
                    <View>
                        {choosingVerdict == 0 ?
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity style={[styles.button, styles.redButton]}
                                    onPress={() => {
                                        choosingVerdict > 0 ? setChoosing(0) : setChoosing(1);
                                    }}>
                                    <Text style={styles.button_Text}>Reject</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.greenButton]}
                                    onPress={() => {
                                        choosingVerdict > 0 ? setChoosing(0) : setChoosing(2);
                                    }}>
                                    <Text style={styles.button_Text}>Accept</Text>
                                </TouchableOpacity>
                            </View>
                            :                                                        
                            <TouchableOpacity style={[styles.button, setDynaButtonColor(),
                                {width: '95%'}
                            ]}
                                onPress={() => {
                                    setChoosing(0);
                                }}>
                                <Text style={styles.button_Text}>{choosingVerdict == 1 ? "Reject" : "Accept"}</Text>
                            </TouchableOpacity>
                            }                        
                    </View>
                </View>
            }
            { choosingVerdict > 0 ? <VerdictForm userData={props.userData}/> : null}
        </View>
    );
}

const QRScan = (props) => {
    const onGoodRead = e => {        
        let found = false;
        for(let [k, v] of Object.entries(props.ticketData)) {
            v.forEach(v2 => {
                if(v2.ticketID == e.data) {
                    props.setCurrentTicket(v2);
                    props.nav.navigate('OCS Admin Viewing Ticket');
                    found = true;
                }
            });          
        };                 
        if(!found) {
            Alert.alert('Could not find the Ticket from that QR');
        }        
    };

    return(
        <QRCodeScanner
        onRead={onGoodRead}
        flashMode={RNCamera.Constants.FlashMode.auto}
        topContent={
            <Button
            onPress={()=> {
                props.nav.navigate('OCS Admin menu');
            }}
            title='Go back'/>
        }/>
    );
}