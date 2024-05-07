import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert } from 'react-native';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { NewsObject } from '../classes/newsobject.js';
import { loadNewsFromJSON } from '../services/newsloader.js';

let newsObjects = {};

const Stack = createStackNavigator();
const AnnouncementPage = () => {
    const [selectedArticle, setSelectedArticle] = useState(0);
    const [isNewsReady, setNewsLoaded] = useState(false);    
    
    loadNewsFromJSON(
        function(data) {
            for(var i = 0; i < data.length; i++) {
                newsObjects[i] = data[i];                
            }
            
            setNewsLoaded(true);
            //updateAndRerender();
        }
    );    

    if(isNewsReady) {
        return(        
            <Stack.Navigator>
                <Stack.Screen name="Announcements and News">
                    {props => <CardsDisplay {...props} setArticleFunc={setSelectedArticle} articles={newsObjects}/>}
                </Stack.Screen>
                <Stack.Screen name="Reading">
                    {props => <ArticleViewSubpage article={newsObjects[selectedArticle]}/>}
                </Stack.Screen>
            </Stack.Navigator>                  
        );
    } else {
        return(
            <View style={{justifyContent: 'center', height: '100%'}}>
                <Text style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 25
                }}>
                    Loading News...
                </Text>
            </View>
        );
    }
};
export default AnnouncementPage;

const CardsDisplay = (props) => {
    let cards = [];
    for(const [key, value] of Object.entries(props.articles)) {
        cards.push(            
            <NewsCard
            
            key={String(key)}
            id={String(key)}
            date={new Date(value.date).toDateString()}
            header={value.title}
            teaser={value.teaserText}

            previewImgSrc={value.previewImgSrc} 
            
            nav = {props.navigation}
            setArticleFunc = {props.setArticleFunc}
            />
        );        
    }

    return(
        <ScrollView
        style={{                
            height: '100%'
        }}>

            {cards}
        </ScrollView>
    );
};

const NewsCard = props => {
    const style = StyleSheet.create({
        container: {
            margin: 10,
            marginBottom: 0,
            padding: 10,

            alignContent: 'center',                                                
            backgroundColor: '#b3b3b3',
            borderRadius: 15,
            width: 'calc(100% - 10)'         
        },
        headlineText: {
            fontWeight: 'bold',   
            textAlign: 'center',         
            marginTop: 10
        },
        teaserText: {
            textAlign: 'center',
        },
        previewImage: {            
            width: '100%',
            height: undefined, 
            aspectRatio: 1.75,    
            borderRadius: 15,       
        }
    });

    function onNewsClicked() {
        props.nav.navigate('Reading');
        props.setArticleFunc(props.id);
    }

    return(
        <TouchableOpacity onPress={onNewsClicked}>
            <View
            style={style.container}
            onPress>
                
                <Text style={{marginBottom: 5}}>
                    {props.date}
                </Text>
                <Image
                source={props.previewImgUri}
                src={props.previewImgSrc}
                style={style.previewImage}></Image>
                <Text
                style={style.headlineText}>
                    {props.header}
                </Text>
                <Text
                style={style.teaserText}>
                    {props.teaser}
                </Text>
            </View>                
        </TouchableOpacity>
    );
};

const ArticleViewSubpage = (props) => {
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
            textAlign: 'justify',
        }
    });

    let i = 0;
    let images = [];
    props.article.images.forEach(image => {        
        images.push(
            <Image key={String(i)} src={image}
            style={{width: '75%', height: undefined, aspectRatio: 1, margin: 10, borderRadius: 15}}/>            
        );
        i++;
    });    

    return(
        <ScrollView style={style.container}>
            <ImageBackground src={props.article.previewImgSrc}
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
                    <Text style={style.title}>{props.article.title}</Text> 
                </View>                
            </ImageBackground>            

            <Text style={style.metaData}>Published on {new Date(props.article.date).toDateString()}</Text>
            <Text style={style.metaData}>Uploaded by {props.article.uploader}</Text>
            
            <Text style={style.body}>{props.article.body}</Text>

            <Text style={{marginTop: 25, fontWeight: 'bold'}}>Attached Images:</Text>
            <View>
                { images }                
            </View>            
        </ScrollView>       
    );
};