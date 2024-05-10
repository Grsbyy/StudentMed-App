import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const FailScreen = (props) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Ionicons name='cloud-offline-outline' size={100} color='gray' />
            <Text style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 15
            }}>
                {props.text}
            </Text>
        </View>
    );
};
export default FailScreen;