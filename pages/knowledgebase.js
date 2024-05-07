import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert } from 'react-native';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const KnowledgeBasePage = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Knowledge Base">
                {props => <KBHome/>}
            </Stack.Screen>
        </Stack.Navigator>
    );
};
export default KnowledgeBasePage;

const KBHome = () => {
    return(
        <ScrollView style={{
            height: '100%'
        }}>
            <KBButton
            imgSrc='https://as2.ftcdn.net/v2/jpg/03/59/43/73/1000_F_359437390_WHAi6PVJZjUArqF4qLTlGqjHYhFghKr4.jpg'
            title='Illnesses Catalog'/>

            <KBButton
            imgSrc='https://upload.wikimedia.org/wikipedia/commons/d/d2/Zamboanga_del_Norte_Medical_Center.jpg'
            title='Hospital Directory'/>
        </ScrollView>
    )
;}

const KBButton = (props) => {
    const styles = StyleSheet.create({
        container: {
            margin: 5,
            height: 150,                        
        },
        darken: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            flex: 1,
            justifyContent: 'center',
            borderRadius: 15,
        },
        buttonText: {
            fontWeight: 'bold',
            fontSize: 25,
            textAlign: 'center',
            color: 'white'
        }
    });

    return(
        <TouchableOpacity>
            <ImageBackground src={props.imgSrc}
            style={styles.container}
            imageStyle={{
                borderRadius: 15
            }}>
                <View style={styles.darken}>
                    <Text style={styles.buttonText}>{props.title}</Text>
                </View>            
            </ImageBackground>        
        </TouchableOpacity>        
    );
};