import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert } from 'react-native';
import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import OCIMain from './svc_ocipage';
import OCIAdmin from './svc_ociadmin';

const Stack = createStackNavigator();
const ServicesPage = (props) => {
    return(
        <Stack.Navigator>
            <Stack.Screen name = "Tools and Services">
                { props2 => <SVCHome {...props2} userData={props.userData} isAdmin={props.isAdmin}/>}
            </Stack.Screen>
            <Stack.Screen options={{headerShown:false}} name="Online Clinic System">
                { props2 => <OCIMain {...props2} userData={props.userData}/>}
            </Stack.Screen>
            <Stack.Screen options={{headerShown:false}} name="OCS Admin">
                { props2 => <OCIAdmin {...props2} userData={props.userData} isAdmin={props.isAdmin}/>}
            </Stack.Screen>
        </Stack.Navigator>
    );
};
export default ServicesPage;

const SVCHome = (props) => {
    var adminButton = props.isAdmin ? 
        <SVCButton
            imgSrc='https://t3.ftcdn.net/jpg/02/26/35/20/360_F_226352071_wOWtMmihfuqF0DVSGTZede0oKas4qxvc.jpg'
            ioniconIcon='construct-outline'
            title='OCS Admin'
            nav={props.navigation}
            dest='OCS Admin'
        /> : null;

    return(
        <ScrollView style={{
            height: '100%'
        }}>

            <SVCButton
            imgSrc='https://previews.123rf.com/images/gena96/gena961210/gena96121000023/15993765-close-up-a-calendar-page.jpg'
            ioniconIcon='calendar-number-outline'
            title='Menstrual Calculator'
            nav = {props.navigation}
            dest=''
            />

            <SVCButton
            imgSrc='https://shoplineimg.com/5e757ddc77cb07002a43f688/5faa0acf1b58238e1bc9f2d7/800x.jpg?'
            ioniconIcon='scale-outline'
            title='BMI Calculator'
            nav = {props.navigation}
            dest=''
            />

            <SVCButton
            imgSrc='https://t3.ftcdn.net/jpg/02/26/35/20/360_F_226352071_wOWtMmihfuqF0DVSGTZede0oKas4qxvc.jpg'
            ioniconIcon='storefront-outline'
            title='Online Clinic System'
            nav = {props.navigation}
            dest='Online Clinic System'
            />

            {adminButton}
        </ScrollView>
    );
};

const SVCButton = (props) => {
    const styles = StyleSheet.create({
        container: {
            margin: 5,
            height: 150,                        
        },
        darken: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            flex: 1,
            justifyContent: 'center',
            borderRadius: 15,
        },
        buttonText: {
            fontWeight: 'bold',
            fontSize: 25,
            textAlign: 'center',
            color: 'white'
        },
        ionicon: {
            alignSelf: 'center',
            margin: 10
        }
    });

    function onClicked() {
        props.nav.navigate(props.dest);        
    }

    return(
        <TouchableOpacity onPress={ onClicked }>
            <ImageBackground src={props.imgSrc}
            style={styles.container}
            imageStyle={{
                borderRadius: 15
            }}
            blurRadius={10}>
                <View style={styles.darken}>
                    <Ionicons name={props.ioniconIcon} size={60} color={'white'} style={styles.ionicon}/>
                    <Text style={styles.buttonText}>{props.title}</Text>
                </View>            
            </ImageBackground>        
        </TouchableOpacity>        
    );
};