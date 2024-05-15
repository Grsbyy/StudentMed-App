import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert } from 'react-native';
import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenstrualCalc = () => {
    const [isPickerOpen, setPickerOpen] = useState(false);
    const [isEditingFirst, setEditingFirst] = useState(true);
    const [firstDate, setFirstDate] = useState(null);    
    const [dates, addDate] = useState([]);
    const [hasAgreed, setAgreed] = useState(false);

    const getExistingData = async () => {
        try {
            const val = await AsyncStorage.getItem('mens-calc-dates');            
            //console.log(val != null ? 'loaded data' : 'using default data');             
            const partiallyParsed = val != null ? JSON.parse(val) : [];
            const fullyParsed = partiallyParsed.map(e => ({
                day1: new Date(e.day1),
                day2: new Date(e.day2),
                id: e.id
            }));            
            addDate(
                val != null ? fullyParsed : []
            );                       
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(()=> {
        getExistingData();
    }, []);

    const styles = StyleSheet.create({
        sectionContainer: {
            padding: 15, margin: 15, marginTop: 0,
            borderRadius: 15,
            backgroundColor: '#db79cc',
        },
        standardText: {
            color: 'white',
            textAlign: 'center'
        },
        headerText: {
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 20
        },
        subText: {
            textAlign: 'center',
            fontSize: 15
        },
        standardButton: {
            backgroundColor: 'white',
            padding: 15, margin: 15,
            borderRadius: 15,
        }
    });

    const DateHolder = (props) => {
        return (
            <View style={{ borderRadius: 5, borderWidth: 2, borderColor: 'white', margin: 5, padding: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                <View style={{ width: '50%' }}>
                    <Text style={[styles.standardText, { fontWeight: 'bold' }]}>First day:
                    </Text>
                    <View style={styles.standardButton}>
                        <Text style={[styles.standardText, { color: 'black', fontWeight: 'bold' }]}>
                            {props.day1}
                        </Text>
                    </View>
                </View>
                <View style={{ width: '50%' }}>
                    <Text style={[styles.standardText, { fontWeight: 'bold' }]}>Last day:
                    </Text>
                    <View style={styles.standardButton}>
                        <Text style={[styles.standardText, { color: 'black', fontWeight: 'bold' }]}>
                            {props.day2}
                        </Text>
                    </View>
                </View>               
                <TouchableOpacity onPress={()=> {                    
                    addDate(oldVal => {
                        var retVal = [...oldVal.filter(e => e.id != props.id)];
                        saveData(retVal);
                        return retVal;
                    });                    
                }}>
                    <Ionicons name='trash-outline' size={30} color='white'/>                
                </TouchableOpacity>                     
            </View>
        );
    };

    const saveData = async (val) => {
        try {            
            const toSave = val.map(elem => ({
                day1: elem.day1.getTime(),
                day2: elem.day2.getTime(),
                id: elem.id
            }));            
            const jVal = JSON.stringify(toSave);
            await AsyncStorage.setItem('mens-calc-dates', jVal);            
        } catch (err) {
            console.error(err);
        }
    };

    const deleteData = async (val) => {
        try {
            await AsyncStorage.removeItem('mens-calc-dates');            
        } catch(err) {
            console.error(err);
        }
    };

    const listOfDates = [];
    sortedDates = dates.sort((a, b) => {
        if (a.day1 !== b.day1) {
            return a.day1 - b.day1;
        } else {
            return 0;
        }
    });

    var dataValid = true;
    for (var i = 0; i < sortedDates.length - 1; i++) {
        if (sortedDates[i].day2 >= sortedDates[i + 1].day1) {            
            dataValid = false;        
        }
    }    
    
    const intervalArr = [];
    const durationArr = [];
    var nextStart;
    var nextEnd;
    var meanInterval = 0;
    var meanDuration = 0;
    if(dataValid) {
        for(var i = 0; i < sortedDates.length - 1; i++) {
            intervalArr.push((sortedDates[i+1].day1 / 86400000) - (sortedDates[i].day2 / 86400000));
        }
        for(var i = 0; i < sortedDates.length; i++) {
            durationArr.push((sortedDates[i].day2 / 86400000) - (sortedDates[i].day1 / 86400000));
        }
    }
    dataValid = dataValid && (intervalArr.length > 0 && durationArr.length > 0);
    if (dataValid) {
        const average = (arr) => arr.reduce((a, b) => a + b) / arr.length;
        meanInterval = average(intervalArr);
        meanDuration = average(durationArr);        
        
        nextStart = sortedDates[sortedDates.length - 1].day2.getTime() + (meanInterval * 86400000);        
        nextEnd = nextStart + (meanDuration * 86400000);

        saveData(dates);
    }

    sortedDates.forEach(date => {
        listOfDates.push(
            <DateHolder
                key={date.id}
                id={date.id}
                day1={date.day1.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
                day2={date.day2.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })} />
        );
    });

    if(hasAgreed) {
        return(
            <ScrollView style={{ height: '100%', backgroundColor: '#b350a3' }}>
                <View style={[styles.sectionContainer, {marginTop: 15}]}>
                    <View>
                        <Text style={[styles.standardText, styles.headerText]}>Step 0: Disclaimer</Text>
                        <Text style={[styles.standardText, styles.subText]}>
                            A tremendous amount of effort, study, and guidance has been put into this tool,
                            and it should be highly accurate. However, this tool <Text style={{fontWeight: 'bold'}}>SHOULD NOT </Text>
                            be used in lieu of your school nurse, any doctor, any registered nurse, or any healthcare professional  for that matter.
                        </Text>
                    </View>                    
                </View>
                <View style={styles.sectionContainer}>
                    <View>
                        <Text style={[styles.standardText, styles.headerText, {fontSize: 30}]}>Step 1: Input</Text>
                        <Text style={[styles.standardText, styles.subText]}>Enter your recent menstrual cycles.
                            Press the '+' button to add a pair of start and end dates.</Text>
                    </View>
                    <View>
                        <View>
                            {listOfDates}
                        </View>
                        {/* IDEAS:
                    1 - First sort bleeding dates by first date,
                    2 - Once in order, check end date of n does not overlap with start date of n+1,
                    3 - Calculate average of days between end date of n and start date of n+1,
                    4 - Calculate average of days between a pairs start date and end date 
                     */}
                        <TouchableOpacity style={[styles.standardButton, {width: 'auto'}]}
                            onPress={() => {
                                setPickerOpen(true);
                            }}>
                            <Text style={[styles.standardText, styles.headerText, { color: 'black' }]}>
                                {isEditingFirst ? "+" : "Please add the last day too"}
                            </Text>
                            <DatePicker
                                modal
                                mode='date'
                                open={isPickerOpen}
                                date={new Date()}
                                onConfirm={(date) => {
                                    if (!isEditingFirst) {
                                        if (firstDate < date) {
                                            console.log('Add date pair: [' + firstDate + "] and [" + date + "]");
                                            addDate(oldVal => {
                                                // return [...oldVal, {
                                                //     day1:firstDate, date, (Math.floor(firstDate.getTime() / 1000))
                                                // ]}

                                                return [...oldVal, {day1: firstDate, day2: date, id:Math.floor(firstDate.getTime() / 1000)}]
                                            });
                                        } else {
                                            Alert.alert("Please select a valid end date!")
                                        }
                                    } else {
                                        setFirstDate(date);
                                    }

                                    setEditingFirst(oldValue => { return !oldValue });
                                    setPickerOpen(false);
                                }}
                                onCancel={() => {
                                    setPickerOpen(false);
                                }}
                                title={
                                    isEditingFirst ?
                                        "Enter the date of the start of bleeding" :
                                        "Enter the date of the end of bleeding"
                                }
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.sectionContainer}>
                    <View>
                        <Text style={[styles.standardText, styles.headerText, {fontSize: 30}]}>Step 2: Results</Text>
                    </View>
                    <View>
                        {dataValid ?
                            <View>
                                <Text style={[styles.standardText]}>
                                    Based on the data you have inputted, the earliest time your next period will be on:
                                </Text>
                                <View style={styles.standardButton}>
                                    <Text style={[styles.standardText, styles.headerText, { color: 'black' }]}>
                                        {new Date(nextStart).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                </View>
                                <Text style={[styles.standardText]}>
                                    Which will then end on:
                                </Text>
                                <View style={styles.standardButton}>
                                    <Text style={[styles.standardText, styles.headerText, { color: 'black' }]}>
                                        {new Date(nextEnd).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                </View>
                            </View>
                            :
                            <Text style={[styles.standardText]}>We couldn't calculate your data! Please make sure the dates you entered are valid and don't overlap</Text>
                        }
                    </View>
                </View>
                <View style={styles.sectionContainer}>
                    <View>
                        <Text style={[styles.standardText, styles.headerText]}>Debug data</Text>
                    </View>
                    <View>
                        <View>
                            <Text style={[styles.standardText, { fontWeight: 'bold', marginBottom: 15 }]}>
                                Don't mind me! This section is to help troubleshoot any errors in the calculations.
                                If you feel like there is a flaw with calculating your cases, we may ask you to screenshot this section if you report an issue.
                            </Text>
                            <Text style={[styles.standardText]}>
                                mean_days_interval (first-to-first ang basehan): {meanInterval.toFixed(2)}
                            </Text>
                            <Text style={[styles.standardText]}>
                                mean_days_duration: {meanDuration}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    } else {
        return(
            <View style={{ height: '100%', backgroundColor: '#b350a3', justifyContent: 'center'}}>
                <View style={styles.sectionContainer}>
                    <View>
                        <Text style={[styles.standardText, styles.headerText, {fontSize: 30}]}>Let's discuss privacy...</Text>
                        <Text style={[styles.standardText, styles.subText, {textAlign: 'left', fontSize: 20, marginBottom: 15}]}>
                            In the topic of online applications, especially ones relevant in the public health sector,
                            we (the team behind this program) are objective, meticulous, and prudent in handling your personal data.                            
                        </Text>
                        <Text style={[styles.standardText, styles.subText, {textAlign: 'left', fontSize: 20, marginBottom: 15}]}>
                            The Menstrual Cycle Calculator does not upload or publish any of your data online.
                            But we do store your data locally on your phone to allow you to re-open it seamlessly from where you left it last time for convenience.
                        </Text>
                        <Text style={[styles.standardText, styles.subText, {textAlign: 'left', fontSize: 20, marginBottom: 15}]}>
                            By clicking on the 'PROCEED' button, you acknowledge and are aware of the functions of this calculator.
                        </Text>
                        <TouchableOpacity style={styles.standardButton}
                            onPress={() => {
                                setAgreed(true);
                            }}>
                            <Text style={[styles.standardText, styles.headerText, { color: 'black' }]}>
                                PROCEED
                            </Text>                            
                        </TouchableOpacity>
                    </View>                    
                </View>
            </View>
        );
    }
};
export default MenstrualCalc;