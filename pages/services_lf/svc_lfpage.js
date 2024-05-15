import React, { useEffect, useReducer, useState, useSyncExternalStore } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button, Switch } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import FailScreen from '../misc/fail_screen';
import LoadingScreen from '../misc/loading_screen';
import TicketViewer from '../misc/ticketviewer';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limitToLast, onSnapshot, query, refEqual, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { firestore, firebaseStorage } from '../../services/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import DatePicker from 'react-native-date-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import GLOBAL from '../../global.js';

const Stack = createStackNavigator();
const LFMain = (props) => {
    if(!GLOBAL.hasAgreedToLF) {
        GLOBAL.hasAgreedToLF = true;
        Alert.alert("Warning!", "The Lost and Found reporting system is still a work in progress [WIP],"
    + " we intend to further implement other stuff like, reporting/claiming found items and notifications.");
    }    
    return (
        <Stack.Navigator>
            <Stack.Screen name='Lost and Found reporting system'>
                {props2 => props.userData != null ?
                    <LFHome {...props2} nav={props2.navigation} launchedAsAdmin={props.launchedAsAdmin} />
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
            <Stack.Screen name='Lost and Found reporting'>
                {props2 =>
                    <ReportMissingFound {...props2} userData={props.userData} nav={props.navigation} />
                }
            </Stack.Screen>
        </Stack.Navigator>
    );
};
export default LFMain;

const LFHome = (props) => {
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [selectedItem, setSelecteditem] = useState(null);
    const [itemData, setItemData] = useState([]);
    const [imageData, setImageData] = useState({});

    const [isViewingActive, setIsViewingActive] = useState(true);

    const fetchItems = async () => {
        try {
            const unsub = onSnapshot(
                collection(firestore, 'lf-reports'),
                qSnap => {
                    qSnap.forEach(dSnap => {
                        const uid = dSnap.data().uid;
                        onSnapshot(
                            collection(firestore, 'lf-reports/' + uid + '/filed-reports'),
                            qSnap2 => {
                                const data = !props.launchedAsAdmin ?
                                    qSnap2.docs.map(dSnap2 => ({
                                        ...dSnap2.data(), id: dSnap.id
                                    })).filter(d => d.isPublished && d.reportType < 2)
                                    :
                                    qSnap2.docs.map(dSnap2 => ({
                                        ...dSnap2.data(), id: dSnap.id
                                    }))
                                    ;

                                data.forEach(_data => {
                                    getDownloadURL(ref(firebaseStorage,
                                        'lf-report-images/' + _data.ticketID + '/image0.jpg'
                                    )).then(url => {
                                        setImageData(oldVal => {
                                            return { ...oldVal, [_data.ticketID]: url }
                                        });
                                    });
                                });

                                setItemData(data);
                            }
                        )
                    });
                }
            )

            return unsub;
        } catch (err) {
            console.error(err);
            Alert.alert("Failed to fetch the data!");
        }
    };
    useEffect(() => {
        fetchItems();
    }, []);

    const styles = StyleSheet.create({
        reportButton: {
            backgroundColor: '#ff6347',

            margin: 10, padding: 15,
            borderRadius: 15,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center'
        },
        buttonText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold'
        },
        lostItemContainer: {
            backgroundColor: '#ff5959',
            borderRadius: 15,
            margin: 10, padding: 10,
            justifyContent: 'center',
        },
        containedText: {
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            marginTop: 10
        },
        contentText: {
            fontWeight: 'regular',
            marginTop: 0
        },
        image: {
            width: '100%', height: undefined, aspectRatio: 4 / 3,
        },
        submitButton: {
            margin: 10, padding: 10,
            backgroundColor: 'white',
            borderRadius: 5,
        },
        sBText: {
            color: 'black',
            fontSize: 25, fontWeight: 'bold',
            textAlign: 'center'
        }
    });

    const ReportButton = (props) => {
        const [isActive, setActive] = useState(false);
        const [displayName, setDisplayName] = useState(props.itemData.reportedBy);

        const fetchName = async () => {
            try {
                getDocs(query(
                    collection(firestore, 'users'),
                    where('uid', '==', props.itemData.reportedBy)
                )).then(qSnap => {
                    qSnap.forEach(dSnap => {
                        setDisplayName(dSnap.data().display_name)
                    });
                });
            } catch (err) {
                Alert.alert("Couldn't get the person's name!", err);
                console.error(err);
            }
        };
        useEffect(() => {
            fetchName();
        }, []);

        return (
            <TouchableOpacity style={[styles.lostItemContainer,
            (props.isPendingForAdmin && props.itemData.reportType < 2) || props.itemData.reportType == 2 ? { backgroundColor: 'gray' } : null
            ]}
                onPress={() => {
                    setActive(!isActive);
                }}>
                <Text style={styles.containedText}>{props.itemData.reportType == 0 ? 'Lost item' : 'Found Item'}</Text>
                <Text style={[styles.containedText, { fontSize: 25 }]}>{props.itemData.itemName}</Text>
                <View style={{ overflow: 'hidden', borderRadius: 5, margin: 5 }}>
                    {[props.itemData.ticketID] in imageData ?
                        <Image style={styles.image} resizeMode='cover'
                            source={{
                                uri: imageData[props.itemData.ticketID]
                            }} />
                        : null}
                </View>
                <Text style={[styles.containedText]}>Description</Text>
                <Text style={[styles.containedText, styles.contentText]}>{props.itemData.itemDescription}</Text>
                <Text style={[styles.containedText]}>{props.itemData.reportType == 0 ? 'Last seen' : 'Found on'}</Text>
                <Text style={[styles.containedText, styles.contentText]}>{props.itemData.timestamp_lostfound.toDate().toLocaleString()}</Text>
                <Text style={[styles.containedText]}>{props.itemData.reportType == 0 ? 'Reported lost by' : 'Found by'}</Text>
                <Text style={[styles.containedText, styles.contentText]}>{displayName}</Text>
                {isActive && props.itemData.reportType != 2 ?
                    <TouchableOpacity
                        onPress={() => {
                            if (props.itemData.reportType == 2) return;

                            if (props.isPendingForAdmin) {
                                Alert.alert(
                                    'Select an option',
                                    'Do you want to approve or deny this?', [
                                    {
                                        text: 'Approve', onPress: async () => {
                                            //On Approve
                                            await setDoc(doc(firestore, 'lf-reports/' + props.itemData.reportedBy + '/filed-reports/', props.itemData.ticketID), {
                                                isPublished: true
                                            }, { merge: true });
                                        }
                                    },
                                    {
                                        text: 'Deny', onPress: async () => {
                                            //On Deny
                                            deleteDoc(doc(firestore, 'lf-reports/' + props.itemData.reportedBy + '/filed-reports/', props.itemData.ticketID))
                                            .then(()=>{
                                                deleteObject(ref(firebaseStorage, 'lf-report-images/' + props.itemData.ticketID + '/image0.jpeg'));
                                            });
                                        }
                                    },
                                ],
                                    { cancelable: false }
                                )
                            } else {
                                Alert.alert("This feature is not yet implemented.");
                            }
                        }}
                        style={styles.submitButton}>
                        <Text style={styles.sBText}>
                            {
                                props.isPendingForAdmin ?
                                    'Approve/Deny'
                                    :
                                    props.itemData.reportType == 0 ?
                                        'I found this item.' : 'This item is mine.'
                            }
                        </Text>
                    </TouchableOpacity> : null}
                {props.launchedAsAdmin && props.itemData.reportType != 2?
                    <TouchableOpacity style={styles.submitButton}
                    onPress={async()=>{
                        await setDoc(doc(firestore, 'lf-reports/' + props.itemData.reportedBy + '/filed-reports', props.itemData.ticketID), {
                            reportType: 2                            
                        }, {merge: true});
                    }}>
                        <Text style={[styles.buttonText, {color: 'black'}]}>Resolve this...</Text>
                    </TouchableOpacity>
                    : null}
            </TouchableOpacity>
        );
    };

    const listOfButtons_Active = () => {
        const arr = [];
        itemData.forEach(_idata => {
            if (props.launchedAsAdmin) {
                if (_idata.isPublished && _idata.reportType < 2) {
                    arr.push(
                        <ReportButton itemData={_idata} key={_idata.ticketID} launchedAsAdmin={props.launchedAsAdmin}/>
                    );
                }
            } else {
                arr.push(
                    <ReportButton itemData={_idata} key={_idata.ticketID} launchedAsAdmin={props.launchedAsAdmin}/>
                );
            }
        });
        return arr;
    };

    const listOfButtons_Pending = () => {
        if (!props.launchedAsAdmin) {
            return null;
        }

        const arr = [];
        itemData.forEach(_idata => {
            if (!_idata.isPublished) {
                arr.push(
                    <ReportButton isPendingForAdmin itemData={_idata} key={_idata.ticketID} />
                );
            }
        });
        return arr;
    };

    const listOfButtons_Closed = () => {
        if (!props.launchedAsAdmin) {
            return null;
        }

        const arr = [];
        itemData.forEach(_idata => {
            if (_idata.reportType == 2) {
                arr.push(
                    <ReportButton itemData={_idata} key={_idata.ticketID} launchedAsAdmin={props.launchedAsAdmin}/>
                );
            }
        });
        return arr;
    };

    return (
        <View style={{ height: '100%' }}>
            <View>
                {props.launchedAsAdmin ?
                    <View style={styles.reportButton}
                        onPress={() => { props.nav.navigate('Lost and Found reporting') }
                        }>
                        <Ionicons name='alert-circle-outline' size={30} color='white' />
                        <Text style={[styles.buttonText, { marginLeft: 5 }]}>You are in ADMIN mode!</Text>
                    </View> : null}                
                <TouchableOpacity style={styles.reportButton}
                    onPress={() => { props.nav.navigate('Lost and Found reporting') }
                    }>
                    <Ionicons name='clipboard-outline' size={30} color='white' />
                    <Text style={[styles.buttonText, { marginLeft: 5 }]}>Report a lost or found item</Text>
                </TouchableOpacity>
                {props.launchedAsAdmin ?
                    <View style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text>View only active results:</Text>
                        <Switch
                            value={isViewingActive}
                            onValueChange={(val) => {
                                setIsViewingActive(val);
                            }}
                        />
                    </View>
                    :
                    null}
            </View>
            {isViewingActive ?
                <ScrollView style={{ height: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 35, fontWeight: 'bold' }}>Active Reports:</Text>
                    {listOfButtons_Active()}
                </ScrollView>
                :
                <ScrollView style={{ height: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 35, fontWeight: 'bold' }}>Pending reports:</Text>
                    {listOfButtons_Pending()}
                    <Text style={{ textAlign: 'center', fontSize: 35, fontWeight: 'bold' }}>Closed reports:</Text>
                    {listOfButtons_Closed()}
                </ScrollView>
            }

        </View>
    );
};

const ReportMissingFound = (props) => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [timestamp, setTimestamp] = useState(new Date());
    const [typeIsMissing, setIsMissingOrFound] = useState(true);
    const [imageData, setImageData] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imgAvail, setImgAvail] = useState(false);

    const [myReports, setMyReportData] = useState([]);

    const fetchMyReports = () => {
        try {
            const unsub = onSnapshot(
                collection(firestore, 'lf-reports/' + props.userData.user.id + '/filed-reports'),
                (qSnap) => {
                    const data = qSnap.docs.map((doc) => ({
                        ...doc.data(), id: doc.id
                    }));

                    setMyReportData(data);
                }
            );

            return unsub;
        } catch (err) {
            console.error(err);
            Alert.alert("Failed to fetch your reports", err);
        }
    };
    useEffect(() => {
        fetchMyReports();
    }, []);

    const styles = StyleSheet.create({
        containerBox: {
            backgroundColor: 'gray',
            borderRadius: 15,

            padding: 15, margin: 10,

            justifyContent: 'center'
        },
        headerText: {
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 25,
            color: 'white',

            marginBottom: 15
        },
        textInput: {
            backgroundColor: '#4a4a4a',
            padding: 5,
            marginBottom: 10,
            borderRadius: 5,
            color: 'white',
        },
        modeHandlerContainer: {
            height: 40, width: '100%', flexDirection: 'row'
        },
        missingHandler: {
            flex: 1, backgroundColor: '#ff5959',
            borderBottomLeftRadius: 10, borderTopLeftRadius: 10,
            justifyContent: 'center'
        },
        foundHandler: {
            flex: 1, backgroundColor: '#66b83d',
            borderBottomRightRadius: 10, borderTopRightRadius: 10,
            justifyContent: 'center'
        },
        deselHandler: {
            backgroundColor: '#4a4a4a'
        },
        handlerText: {
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 20
        },
        button: {
            borderRadius: 5,
            backgroundColor: '#b3b3b3',
            padding: 10, width: '100%',
            marginTop: 15
        },
        buttonText: {
            fontWeight: 'bold',
            fontSize: 20,
            color: 'white',
            textAlign: 'center'
        }
    });

    const myPendingReports = [];
    const myPublishedReports = [];
    const myClosedReports = [];

    const ReportViewerShort = (props) => {
        return (
            <View style={[styles.containerBox, props.isRed ? { backgroundColor: '#ff5959' } : null]} key={props.rpt.ticketID}>
                <Text style={styles.headerText}>Report (Ticket #{props.rpt.ticketID})</Text>
                <Text style={[styles.headerText, { fontSize: 20, marginBottom: 0 }]}>Item Name: {props.rpt.itemName}</Text>
                <Text style={[styles.headerText, { fontSize: 20, marginBottom: 0 }]}>Date reported: {props.rpt.dateFiled.toDate().toLocaleString()}</Text>
            </View>
        );
    };

    myReports.forEach(rpt => {
        if (!rpt.isPublished) {
            myPendingReports.push(
                <ReportViewerShort rpt={rpt} key={rpt.ticketID} />
            )
        } else if (rpt.isPublished && rpt.reportType < 2) {
            myPublishedReports.push(
                <ReportViewerShort isRed rpt={rpt} key={rpt.ticketID} />
            );
        } else {
            myClosedReports.push(
                <ReportViewerShort rpt={rpt} key={rpt.ticketID} />
            );
        }
    })

    return (
        <ScrollView style={{ height: '100%' }}>
            <View style={styles.containerBox}>
                <Text style={styles.headerText}>{typeIsMissing ? 'Report missing item' : 'Report item found'}</Text>
                <View style={styles.modeHandlerContainer}>
                    <TouchableOpacity style={[styles.missingHandler, typeIsMissing ? null : styles.deselHandler]}
                        onPress={() => { setIsMissingOrFound(true); }}>
                        <Text style={[styles.handlerText, { color: typeIsMissing ? '#993636' : 'gray' }]}>Missing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.foundHandler, typeIsMissing ? styles.deselHandler : null]}
                        onPress={() => { setIsMissingOrFound(false); }}>
                        <Text style={[styles.handlerText, { color: typeIsMissing ? 'gray' : '#366121' }]}>Found</Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.headerText, { fontSize: 20, marginTop: 10 }]}>{typeIsMissing ? 'Name of item missing' : 'Name of item found'}:</Text>
                <TextInput style={styles.textInput} value={itemName}
                    onChangeText={(e) => {
                        setItemName(e);
                    }} />
                <Text style={[styles.headerText, { fontSize: 20 }]}>Additional description:</Text>
                <TextInput style={styles.textInput} value={description}
                    onChangeText={(e) => {
                        setDescription(e);
                    }} />
                <View style={{
                    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
                    borderRadius: 15, padding: 15
                }}>
                    <Text style={[styles.headerText, { fontSize: 20, color: 'black' }]}>{typeIsMissing ? 'Last seen' : 'Found on'}:</Text>
                    <DatePicker
                        mode='datetime'
                        date={timestamp}
                        onDateChange={setTimestamp} />
                </View>
                {!imgAvail ?
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            launchImageLibrary({
                                mediaType: 'photo',
                                includeBase64: true
                            },
                                (response) => {
                                    setImagePreview(response.assets[0].uri);;
                                    setImageData(response.assets[0].base64);
                                    setImgAvail(true);
                                });
                        }}>
                        <Text style={styles.buttonText}>Upload image</Text>
                    </TouchableOpacity>
                    :
                    <View style={{ margin: 15, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <Text style={styles.headerText}>Attached image:</Text>
                        <Image style={{ borderRadius: 15, width: '80%', height: undefined, aspectRatio: 4 / 3 }} source={{ uri: imagePreview }} />
                        <TouchableOpacity
                            style={[styles.button,
                            { width: '50%' }
                            ]}
                            onPress={() => {
                                launchImageLibrary({
                                    mediaType: 'photo',
                                    includeBase64: true
                                },
                                    (response) => {
                                        setImagePreview(response.assets[0].uri);;
                                        setImageData(response.assets[0].base64);
                                        setImgAvail(true);
                                    });
                            }}>
                            <Text style={styles.buttonText}>Change image</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    imgAvail ?
                        <TouchableOpacity style={[styles.button, { backgroundColor: 'white' }]}
                            onPress={() => {
                                if (itemName.length > 0, description.length > 0) {
                                    submitMissingReport(props.userData, itemName, description, typeIsMissing, timestamp, imagePreview, props.nav);
                                } else {
                                    Alert.alert("Please complete the form");
                                }
                            }}>
                            <Text style={[styles.buttonText, { color: 'black' }]}>SUBMIT</Text>
                        </TouchableOpacity>
                        : null
                }
            </View>

            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>My pending reports:</Text>
            <View>
                {myPendingReports}
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>My published reports:</Text>
            <View>
                {myPublishedReports}
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>My resolved reports:</Text>
            <View>
                {myClosedReports}
            </View>
        </ScrollView>
    );
};

const submitMissingReport = async (_uData, _name, _desc, _isMissingOrFound, _timeStamp, _uri, _nav) => {
    try {
        const genTicketNumber = [...Math.floor(new Date() / 1000).toString(16).toUpperCase()].reverse().join("");
        await setDoc(doc(firestore, 'lf-reports/' + _uData.user.id), {
            uid: _uData.user.id,
            name: _uData.displayName
        });


        await uploadBytes(ref(firebaseStorage, 'lf-report-images/' + genTicketNumber + '/image0.jpg'),
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    reject(new TypeError("Getting image failed."));
                }
                xhr.responseType = 'blob';
                xhr.open("GET", _uri, true);
                xhr.send(null);
            })).then(snapshot => {
                setDoc(doc(firestore, 'lf-reports/' + _uData.user.id + '/filed-reports/', genTicketNumber), {
                    dateFiled: Timestamp.fromDate(new Date()),
                    isPublished: false,
                    itemDescription: _desc,
                    itemName: _name,
                    reportType: _isMissingOrFound ? 0 : 1,
                    reportedBy: _uData.user.id,
                    ticketID: genTicketNumber,
                    timestamp_lostfound: Timestamp.fromDate(_timeStamp)
                }).then(e => {
                    _nav.navigate('Lost and Found reporting system');
                });
            });
    } catch (err) {
        console.error(err);
    }
};