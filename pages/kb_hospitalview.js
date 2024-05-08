import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert } from 'react-native';
import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { HospitalObject } from '../classes/hospitalobject';
import { loadHospitalsFromWeb } from '../services/loaders.js'

let listHospitals = {};

const Stack = createStackNavigator();
const HospitalsView = () => {
    const [selectedHospital, setSelectedHospital] = useState(0);
    const [isDataReady, setDataLoaded] = useState(false);
    const [isDataFetchFailed, setFetchFailed] = useState(false);
    const [, tryAgain] = useReducer(x => x + 1, 0);

    loadHospitalsFromWeb(
        function(data) {
            for(var i = 0; i < data.length; i++) {
                listHospitals[i] = data[i];
            }

            setDataLoaded(true);
        },

        function() {
            setFetchFailed(true);
        }
    )

    if(isDataFetchFailed) {
        return(
            <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Ionicons name='cloud-offline' size={100} color='gray'/>
                <Text style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 15
                }}>
                    There was an error, sorry about that!
                </Text>
                
                <Button
                title="Retry"
                onPress={
                    function() {
                        tryAgain();
                    }
                }
                />
            </View>
        );
    } else if(isDataReady && !isDataFetchFailed) {
        if(listHospitals.length == 0) {
            return(
                <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <Ionicons name='partly-sunny' size={100} color='gray'/>
                    <Text style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>
                        No hospitals here...
                    </Text>

                    <Button
                    title="Retry"
                    onPress={
                        function() {
                            tryAgain();
                        }
                    }
                    />
                </View>
            );
        } else {
            return(
                <Stack.Navigator>
                    <Stack.Screen name="Hospitals">
                        {props => <ListHospitalsDisplay {...props} setHospitalFunc={setSelectedHospital} hospitals={listHospitals}/>}
                    </Stack.Screen>
                    <Stack.Screen name="Viewing">
                        {props => <DetailedHospitalPage {...props} hospital={listHospitals[selectedHospital]}/>}
                    </Stack.Screen>
                </Stack.Navigator>                
            );            
        }
    } else if (!isDataReady) {
        return(
            <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Ionicons name='hourglass-outline' size={100} color='gray'/>
                <Text style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 15
                }}>
                    Loading...
                </Text>
            </View>
        );
    }
};
export default HospitalsView;

const ListHospitalsDisplay = (props) => {
    const [searchText, setSearchText] = useState('');
    const [, refresh] = useReducer(x => x + 1, 0)

    let cards = [];
    let searchHosps = function() {
        let newArr = [];
        for(const [k,v] of Object.entries(props.hospitals)) {
            if(searchText.length > 0 && !v.name.toLowerCase().includes(searchText.toLowerCase())) {
                continue;
            }

            newArr.push(
                <HospitalButton
                icon = {v.icon}
                hospitalName = {v.name}
                location = {v.location}
                distance = {v.distance}
                key = {String(k)}
                id={k}
    
                nav = {props.navigation}
                setHospitalFunc = {props.setHospitalFunc}
                />
            );
        }
        return newArr;
    }    
    cards = searchHosps();

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
            <Text style={style.body}>Services offered: {props.hospital.services.toString()}</Text>
        </ScrollView>       
    );
};

