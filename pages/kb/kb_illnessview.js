import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert } from 'react-native';
import FailScreen from '../misc/fail_screen.js';
import LoadingScreen from '../misc/loading_screen.js';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { collection, getDoc, getDocs } from 'firebase/firestore';
import {firestore} from '../../services/firebase.js';

const Stack = createStackNavigator();
const IllnessesView = () => {
    const [selectedIllness, setSelectedIllness] = useState(null);
    const [isDataReady, setDataLoaded] = useState(false);
    const [illnessData, setIllnessData] = useState([]);    

    const fetchIllnesses = async () => {
        try {
            await getDocs(collection(firestore, 'kb/ILLNESSES/illnesses'))
            .then((qSnap => {
                const data = qSnap.docs.map((dSnap)=>({
                    ...dSnap.data(), id:dSnap.id
                }));

                setIllnessData(data);
                setDataLoaded(true);
            }));
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(()=> {
        fetchIllnesses();
    }, []);

    if(isDataReady) {
        return(
            <Stack.Navigator>
                <Stack.Screen name='Illnesses Directory'>
                    {props => 
                    <ListIllnessesDisplay {...props} setSelectedIllness={setSelectedIllness} illnessData={illnessData}/>
                    }
                </Stack.Screen>
                <Stack.Screen name='Viewing'>
                    {props =>
                    <DetailedIllnessPage {...props} illness={selectedIllness}/>
                    }
                </Stack.Screen>
            </Stack.Navigator>
        );
    } else {
        return(
            <LoadingScreen text='Loading illnesses...'/>
        );
    }
};
export default IllnessesView;

const ListIllnessesDisplay = (props) => {
    const [searchText, setSearchText] = useState('');
    
    let cards = [];
    let i = 0;
    props.illnessData.forEach(ill => {
        if(searchText.length == 0 || ill.name.toLowerCase().includes(searchText.toLowerCase())) {
            cards.push(
                <IllnessButton
                illness={ill}
                key={ill.id}
                
                nav={props.navigation}
                setSelectedIllness={props.setSelectedIllness}/>
            );
        }
    });

    return(
        <View style={{height: '100%'}}>
            <TextInput
            style={{
                borderWidth: 1, borderColor: 'gray',
                borderRadius: 10,

                margin: 10,
                height: 50
            }}
            placeholder='Search an illness'
            value={searchText}
            onChangeText={text => setSearchText(text)}            
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

const IllnessButton = (props) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',

            borderBottomColor: '#b3b3b3',
            borderBottomWidth: 2,

            padding: 15
        },
        illnessName: {
            fontWeight: 'bold'
        },
        ionicon: {
            marginRight: 10
        }
    });

    function onClicked() {
        props.nav.navigate('Viewing');
        props.setSelectedIllness(props.illness);
    }    

    return(
        <TouchableOpacity onPress={onClicked}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.illnessName}>
                        <Ionicons name='pulse-outline' size={15} color='black'/>
                        {props.illness.name}
                    </Text>
                    <Text>
                        <Ionicons name='list-outline' size={15} color='black'/>
                        Symptoms: {props.illness.symptoms.map(e => " " + e.name).toString()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const DetailedIllnessPage = (props) => {
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
            <ImageBackground src={props.illness.image}
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
                    <Text style={style.title}>{props.illness.name}</Text> 
                </View>                
            </ImageBackground>            
            
            <Text style={style.body}>{props.illness.description}</Text>
            <Text style={style.body}>Symptoms: {props.illness.symptoms.map(e => " " + e.name + " (" + e.severity + ")").toString()}</Text>
            <Text style={style.body}>Treatments: {props.illness.treatments.map(e => " " + e).toString()}</Text>
            
            <Image src={props.illness.image}
            style={{width: '90%', height: undefined, aspectRatio: 1.75, borderRadius: 15}}/>
        </ScrollView>        
    );    
};