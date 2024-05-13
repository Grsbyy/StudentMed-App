import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Ionicons from 'react-native-vector-icons/Ionicons';

const BMICalc = (props) => {
    const [usingCentimeters, setUseCentimeters] = useState(true);
    const [weightPopulated, setWeightPopulated] = useState(false);
    const [heightPopulated, setHeightPopulated] = useState(false);
    const [weight_kgs, setWeight] = useState(0);
    const [height_cm, setHeight_cm] = useState(0);
    const [height_in, setHeight_in] = useState(0);
    const [height_ft, setHeight_ft] = useState(0);

    const styles = StyleSheet.create({
        sectionContainer: {
            padding: 15, margin: 15, marginTop: 0,
            borderRadius: 15,
            backgroundColor: '#2e4e82'
        },
        standardText: {
            color: 'white',
            textAlign: 'center'
        },
        headerText: {
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 20,
            marginBottom: 10
        },
        subText: {
            textAlign: 'center',
            fontSize: 15
        },
        labelText: {
            textAlign: 'left',
            fontSize: 20,
            fontWeight: 'bold'
        },
        inputFieldContainer: {
            flexDirection: 'row',            
            width: '100%',            
        },
        inputField: {
            backgroundColor: '#1c2e4a',
            flex: 1,
            height: 50,
            color: 'white',
            fontSize: 20,
            padding: 10,
            borderTopLeftRadius: 5, borderBottomLeftRadius: 5
        },
        unitButton: {
            backgroundColor: '#366dc2',
            width: 40,
            height: 50,
            fontSize: 25,
            padding: 5,
            borderTopRightRadius: 5, borderBottomRightRadius: 5,
            justifyContent: 'center'
        },
        unitText: {
            color: 'white', fontWeight: 'bold', fontSize: 20
        }
    });

    var heightInMeters = height_cm / 100;
    if(!usingCentimeters) {
        const heightInInches = parseFloat(height_ft * 12) + parseFloat(height_in);                
        heightInMeters = heightInInches / 39.37;                
    }
    const bmi = weight_kgs / (heightInMeters * heightInMeters);
    const getBmiRange = _bmi => {
        switch(true) {
            case _bmi <= 18.5:
                return "Underweight";
            case _bmi <= 25:
                return "Normal";
            case _bmi <= 30:
                return "Overweight";
            default:
                return "Obese";
        }        
    }

    const styles_bar = StyleSheet.create({
        graphSection: {
            height: 50, flex: 1,
            justifyContent: 'center', alignItems: 'center',
            borderRightWidth: 2
        },
        redSection: {
            backgroundColor: '#e34639',
            borderColor: '#85312a',            
        },
        yellowSection: {
            backgroundColor: '#ffc400',
            borderColor: '#94750d', 
        },
        greenSection: {
            backgroundColor: '#2dcc2d',
            borderColor: '#1e8f1e'
        },
        borderMarkings: {
            fontWeight: 'bold',
            color: 'white'
        }
    });
    const styles_bar_invis = StyleSheet.create({
        graphSection: {
            height: 0, flex: 1,
            justifyContent: 'center', alignItems: 'center',
            borderRightWidth: 2
        },
        redSection: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)',            
        },
        yellowSection: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)', 
        },
        greenSection: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)'
        }
    });
    const determineLeftOffset = (_bmi) => {
        switch(true) {
            case _bmi <= 18.5:
                return (24/(18.5-15))*(_bmi - 15).toFixed()+'%';
            case _bmi <= 25:
                return (((46.5-24)/(25-18.5))*(_bmi - 18.5)+24).toFixed()+'%';
            case _bmi <= 30:
                return (((69-46.5)/(30-25))*(_bmi - 25)+46.5).toFixed()+'%';
            default:
                return (((95-65)/(40-30))*(_bmi - 30)+69).toFixed()+'%';
        }
    };
    const leftOffsetStyle = () => {
        return {
            left: determineLeftOffset(bmi),
        }
    };

    return(
        <ScrollView style={{ height: '100%' }}>
            <View style={[styles.sectionContainer, { marginTop: 15 }]}>
                <Text style={[styles.standardText, styles.headerText, {fontSize: 25, marginBottom: 15}]}>Step 1: Input</Text>
                <Text style={[styles.standardText, styles.labelText]}>
                    Enter your weight:
                </Text>
                <View style={styles.inputFieldContainer}>
                    <TextInput
                    style={styles.inputField}
                    keyboardType='numeric'
                    value={weight_kgs}
                    onChangeText={(e)=>{
                        setWeight(e);
                        setWeightPopulated(e.length > 0);
                    }}                 
                    />
                    <TouchableOpacity style={styles.unitButton}>
                        <Text style={[styles.standardText, styles.unitText]}>kg</Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.standardText, styles.labelText]}>
                    Enter your height:
                </Text>
                { usingCentimeters ? 
                <View>
                    <View style={styles.inputFieldContainer}>
                        <TextInput
                            style={styles.inputField}
                            keyboardType='numeric'
                            value={height_cm}
                            onChangeText={(e) => {
                                if(usingCentimeters) {
                                    setHeight_cm(e);
                                    setHeightPopulated(e.length > 0);
                                }
                            }}
                        />
                        <TouchableOpacity style={styles.unitButton}
                        onPress={()=> {
                            setUseCentimeters(false);                                                     

                            if(!isNaN(parseInt(height_cm))) {
                                setHeight_ft(Math.floor((height_cm / 100) *  3.281).toString());                                
                                setHeight_in(parseInt(((height_cm / 100) *  3.281 % Math.floor((height_cm / 100) *  3.281) * 12)).toString());                                
                                setHeightPopulated(true);
                            } else {
                                setHeightPopulated(false);   
                            }

                            setHeight_cm('');
                        }}>
                            <Text style={[styles.standardText, styles.unitText]}>cm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                : 
                <View>
                    <View style={styles.inputFieldContainer}>
                        <View style={{flex: 1, flexDirection: 'row', marginRight: 10}}>
                                <TextInput
                                    style={styles.inputField}
                                    keyboardType='numeric'
                                    value={height_ft}
                                    onChangeText={(e)=>{
                                        if(!usingCentimeters) {
                                            setHeight_ft(e);                                        
                                            setHeightPopulated(e > 0 && height_in > 0);
                                        }                                        
                                    }}
                                />
                                <TouchableOpacity style={styles.unitButton}
                                onPress={()=>{
                                    setUseCentimeters(true);                                    

                                    if(!isNaN(parseInt(height_in)) && !isNaN(parseInt(height_ft))) {
                                        const h1 = parseFloat(height_ft * 12) + parseFloat(height_in);                
                                        h2 = h1 / 39.37;
                                        setHeight_cm((h2 * 100).toFixed(2));
                                        setHeightPopulated(true);
                                    } else {
                                        setHeightPopulated(false);
                                    }

                                    setHeight_ft(''); setHeight_in('');
                                }}>
                                    <Text style={[styles.standardText, styles.unitText]}>ft</Text>
                                </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                                <TextInput
                                    style={styles.inputField}
                                    keyboardType='numeric'
                                    value={height_in}
                                    onChangeText={(e) => {
                                        if(!usingCentimeters) {
                                            setHeight_in(e);                                        
                                            setHeightPopulated(e > 0 && height_ft > 0);
                                        }
                                    }}
                                />
                                <TouchableOpacity style={styles.unitButton}
                                onPress={()=>{
                                    setUseCentimeters(true);                                    

                                    if(!isNaN(parseInt(height_in)) && !isNaN(parseInt(height_ft))) {
                                        const h1 = parseFloat(height_ft * 12) + parseFloat(height_in);                
                                        h2 = h1 / 39.37;
                                        setHeight_cm((h2 * 100).toFixed(2));
                                        setHeightPopulated(true);
                                    } else {
                                        setHeightPopulated(false);
                                    }

                                    setHeight_ft(''); setHeight_in(''); 
                                }}>
                                    <Text style={[styles.standardText, styles.unitText]}>in</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </View>
                }
            </View>
            <View style={[styles.sectionContainer, { marginTop: 15 }]}>
                <Text style={[styles.standardText, styles.headerText, {fontSize: 25, marginBottom: 15}]}>Step 2: Results</Text>
                {!(heightPopulated && weightPopulated && !isNaN(bmi) && (bmi > 0 && bmi < 100))?
                    <Text style={[styles.standardText]}>
                        Please enter all information to calculate the results.
                    </Text>
                    :
                    <View>
                        <Text style={[styles.standardText, styles.headerText, {fontSize: 20}]}>
                            Your Body-Mass Index:
                        </Text>
                        <Text style={[styles.standardText, styles.headerText, {fontSize: 30}]}>
                            {bmi.toFixed(1)} kg/m²
                        </Text>
                        <Text style={[styles.standardText, styles.headerText, {fontSize: 20}]}>
                            BMI range:
                        </Text>
                        <Text style={[styles.standardText, styles.headerText, {fontSize: 30}]}>
                            {getBmiRange(bmi)}
                        </Text>
                        <Text style={[styles.standardText, styles.headerText, {fontSize: 20}]}>
                            BMI scale:
                        </Text>
                        <View style={{flexDirection: 'row'}}>                                                      
                            <View style={[styles_bar.graphSection, styles_bar.redSection,
                                {width: 20, flex: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5}]}>
                                <Ionicons name='caret-back-outline' size={10} color={'#85312a'}/>
                            </View>
                            <View style={[styles_bar.graphSection, styles_bar.yellowSection]}>
                                <Text style={{color: '#94750d', fontWeight: 'bold'}}>Underweight</Text>
                            </View>
                            <View style={[styles_bar.graphSection, styles_bar.greenSection]}>
                                <Text style={{color: '#1e8f1e', fontWeight: 'bold'}}>Normal</Text>
                            </View>   
                            <View style={[styles_bar.graphSection, styles_bar.yellowSection]}>
                                <Text style={{color: '#94750d', fontWeight: 'bold'}}>Overweight</Text>
                            </View>
                            <View style={[styles_bar.graphSection, styles_bar.redSection]}>
                                <Text style={{color: '#85312a', fontWeight: 'bold'}}>Obese</Text>
                            </View>     
                            <View style={[styles_bar.graphSection, styles_bar.redSection,
                                {width: 20, flex: 0, borderTopRightRadius: 5, borderBottomRightRadius: 5,
                                    borderRightWidth: 0
                                }]}>
                                <Ionicons name='caret-forward-outline' size={10} color={'#85312a'}/>
                            </View>  
                            <Ionicons name='caret-down-outline' color={'white'} size={25}
                            style={[{
                                position: 'absolute',                                
                                top: -15                           
                            }, leftOffsetStyle()]}/>                       
                        </View>   
                        <View style={{flexDirection: 'row'}}>                              
                            <View style={[styles_bar_invis.graphSection, styles_bar_invis.redSection,
                                {width: 20, flex: 0, borderTopLeftRadius: 5, borderBottomLeftRadius: 5}]}>                                
                            </View>
                            <View style={[styles_bar_invis.graphSection, styles_bar_invis.yellowSection]}>                                
                            </View>
                            <Text style={styles_bar.borderMarkings}>18.5</Text>
                            <View style={[styles_bar_invis.graphSection, styles_bar_invis.greenSection]}>                                
                            </View>   
                            <Text style={styles_bar.borderMarkings}>25</Text>
                            <View style={[styles_bar_invis.graphSection, styles_bar_invis.yellowSection]}>                                
                            </View>
                            <Text style={styles_bar.borderMarkings}>30  </Text>
                            <View style={[styles_bar_invis.graphSection, styles_bar_invis.redSection]}>                                
                            </View>     
                            <View style={[styles_bar_invis.graphSection, styles_bar_invis.redSection,
                                {width: 20, flex: 0, borderTopRightRadius: 5, borderBottomRightRadius: 5,
                                    borderRightWidth: 0
                                }]}>                                
                            </View>                       
                        </View>                      
                    </View>                                        
                }                
            </View>
        </ScrollView>
    );
};
export default BMICalc;