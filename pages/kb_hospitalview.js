import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert } from 'react-native';
import FailScreen from './misc/fail_screen.js';
import LoadingScreen from './misc/loading_screen.js';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { collection, getDoc, getDocs } from 'firebase/firestore';
import firestore from '../services/firebase.js';

let listHospitals = {};

const Stack = createStackNavigator();
const HospitalsView = () => {
    const [selectedHospital, setSelectedHospital] = useState(0);
    const [isDataReady, setDataLoaded] = useState(false);
    const [isDataFetchFailed, setFetchFailed] = useState(false);
    const [hospitalData, setHospitalData] = useState([]);    
    const [, tryAgain] = useReducer(x => x + 1, 0);

    const fetchHospitals = async () => {
        try {
            await getDocs(collection(firestore, 'kb/HOSPITALS/hospitals'))
            .then((qSnap) => {
                const data = qSnap.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                }));

                setHospitalData(data);
                setDataLoaded(true);
            });
        } catch(err) {
            setFetchFailed(true);
            console.error(err);
        }
    };
    useEffect(()=>{
        fetchHospitals();
    }, []);

    if (isDataFetchFailed) {
        return (
            <FailScreen text={"Failed to load hospitals, please check your internet connection..."}/>
        );
    }

    if(isDataReady) {
        return(
            <Stack.Navigator>
                <Stack.Screen name="Hospitals Directory">
                    {props => <ListHospitalsDisplay {...props} setHospitalFunc={setSelectedHospital} hospitals={hospitalData}/>}
                </Stack.Screen>
                <Stack.Screen name="Viewing">
                    {props => <DetailedHospitalPage {...props} hospital={hospitalData[selectedHospital]}/>}
                </Stack.Screen>
            </Stack.Navigator>                
        );  
    } else {
        return(
            <LoadingScreen text="Loading hospitals..."/>
        );
    }    
};
export default HospitalsView;

const ListHospitalsDisplay = (props) => {
    const [searchText, setSearchText] = useState('');
    const [, refresh] = useReducer(x => x + 1, 0)

    let cards = [];
    let i = 0;
    props.hospitals.forEach(hosp => {
        if(searchText.length == 0 || hosp.name.toLowerCase().includes(searchText.toLowerCase())) {
            cards.push(
                <HospitalButton
                icon = {hosp.icon}
                hospitalName = {hosp.name}
                location = {hosp.address}
                distance = {hosp.distance}
                key = {hosp.id}
                id={i}
    
                nav = {props.navigation}
                setHospitalFunc = {props.setHospitalFunc}
                />
            );
            i++;
        }            
    });     

    return(
        <View
        style={{
            height: "100%"
        }}>
            <TextInput
            style={{
                borderWidth: 1, borderColor: 'gray',
                borderRadius: 10,

                margin: 10,
                height: 50
            }}
            placeholder='Search a hospital'
            value={searchText}
            onChangeText={text => setSearchText(text)}
            onSubmitEditing={ function() {
                cards = searchHosps();
            }}
            />

            <ScrollView
            style={{
                height: "100%"
            }}>
                
                {cards}
            </ScrollView>
        </View>        
    );
};

const HospitalButton = (props) => {
    const styles = StyleSheet.create({
        container: {   
            // backgroundColor: 'magenta',

            flexDirection: 'row',

            borderBottomColor: '#b3b3b3',
            borderBottomWidth: 2,

            padding: 15          
        },
        hospitalIcon: {
            width: 100, height: 100,
            borderRadius: 15,

            marginRight: 15
        },        
        ionicon: {
            marginRight: 10
        },
        hospitalName: {
            fontWeight: 'bold'
        }
    });

    function onClicked() {
        props.nav.navigate('Viewing');
        props.setHospitalFunc(props.id);
    }

    return(
        <TouchableOpacity onPress={onClicked}>
            <View style={styles.container}>
                <Image 
                style={
                    styles.hospitalIcon
                }
                src={props.icon}/>
                <View>
                    <Text style={styles.hospitalName}>
                        <Ionicons name='medkit-outline' size={15} color='black' style={styles.ionicon}/>
                        {props.hospitalName}</Text>
                    <Text>
                        <Ionicons name='location-outline' size={15} color='black' style={styles.ionicon}/>
                        {props.location}</Text>
                    <Text>
                    <Ionicons name='locate-outline' size={15} color='black' style={styles.ionicon}/>
                        {props.distance}</Text>
                </View>                
            </View>      
        </TouchableOpacity>        
    );
};

const DetailedHospitalPage = (props) => {
    const style = StyleSheet.create({
        bg: {
            width: '100%',
            height: '100%',

        },
        container: {
            padding: 10       
        },
        title: {
            fontWeight: 'bold',
            textAlign: 'center',

            marginBottom: 25,
            marginTop: 25,

            color: 'white'
        },
        metaData: {
            fontSize: 10,
            color: 'gray',
        },
        body: {
            marginTop: 20,
            textAlign: 'left',
        }
    });

    return(
        <ScrollView style={style.container}>
            <ImageBackground src={props.hospital.image}
            style={{
                borderRadius: 5
            }}
            imageStyle={{
                borderRadius: 15
            }}>
                <View style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',     
                    justifyContent: 'center', flex: 1,     
                    borderRadius: 15          
                }}>
                    <Text style={style.title}>{props.hospital.name}</Text> 
                </View>                
            </ImageBackground>            

            <Text style={style.metaData}>Address: {props.hospital.location}</Text>
            <Text style={style.metaData}>Distance: {props.hospital.distance}</Text>
            
            <Image src={props.hospital.image}
            style={{width: '90%', height: undefined, aspectRatio: 1.75, borderRadius: 15}}/>

            <Text style={style.body}>Available hours: {props.hospital.hours}</Text>
            <Text style={style.body}>Contacts: {props.hospital.contact}</Text>
            <Text style={style.body}>Services offered:{props.hospital.services.map((x) => { return " " + x; }).toString()}</Text>
        </ScrollView>       
    );
};

