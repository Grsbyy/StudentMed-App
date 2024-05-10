import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button } from 'react-native';
import FailScreen from './misc/fail_screen.js';
import LoadingScreen from './misc/loading_screen.js';

import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { NewsObject } from '../classes/newsobject.js';
import { loadNewsFromWeb } from '../services/loaders.js';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { collection, getDocs } from 'firebase/firestore';
import firestore from '../services/firebase.js';

let newsObjects = {};

const Stack = createStackNavigator();
const AnnouncementPage = () => {
    const [selectedArticle, setSelectedArticle] = useState(0);
    const [isNewsReady, setNewsLoaded] = useState(false);    
    const [isNewsFetchFail, setNewsFetchFail] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const [, tryAgain] = useReducer(x => x + 1, 0);

    // loadNewsFromWeb(
    //     function(data) {
    //         for(var i = 0; i < data.length; i++) {
    //             newsObjects[i] = data[i];                
    //         }
            
    //         setNewsLoaded(true);            
    //     },

    //     function() {
    //         setNewsFetchFail(true);
    //     }
    // );    

    const fetchNews = async () => {
        try {
            await getDocs(collection(firestore, "news"))
            .then((qSnap) => {
                const data = qSnap.docs.map((doc) => ({
                    ...doc.data(), id: doc.id
                }));
                setNewsData(data);
                setNewsLoaded(true);                        
            });
        } catch (err) {
            setNewsFetchFail(true);
            console.log(err);
        }
        
    };
    useEffect(()=>{
        fetchNews();
    }, [setNewsData])

    if(isNewsFetchFail) {
        return (
            <FailScreen text={"Failed to load your newsfeed, please check your internet connection..."}/>
        );
    }
    
    if (isNewsReady) {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Announcements and News">
                    {props => <CardsDisplay {...props} setArticleFunc={setSelectedArticle} articles={newsData} />}
                </Stack.Screen>
                <Stack.Screen name="Reading">
                    {props => <ArticleViewSubpage {...props} article={newsData[selectedArticle]} />}
                </Stack.Screen>
            </Stack.Navigator>
        );
    } else {
        return (
            <LoadingScreen text={"Loading news..."}/>
        );
    }

    // if(isNewsFetchFail) {
    //     return(
    //         <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    //             <Ionicons name='cloud-offline' size={100} color='gray'/>
    //             <Text style={{
    //                 textAlign: 'center',
    //                 fontWeight: 'bold',
    //                 fontSize: 15
    //             }}>
    //                 We couldn't fetch your newsfeed, sorry about that!
    //             </Text>
                
    //             <Button
    //             title="Retry"
    //             onPress={
    //                 function() {
    //                     tryAgain();
    //                 }
    //             }
    //             />
    //         </View>
    //     );
    // } else if(isNewsReady && !isNewsFetchFail) {
    //     if(newsObjects.length == 0) {
    //         return(
    //             <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    //                 <Ionicons name='partly-sunny' size={100} color='gray'/>
    //                 <Text style={{
    //                     textAlign: 'center',
    //                     fontWeight: 'bold',
    //                     fontSize: 15
    //                 }}>
    //                     There seems to be no published news online...
    //                 </Text>
    //             </View>
    //         );
            
    //     } else {
    //         return(        
    //             <Stack.Navigator>
    //                 <Stack.Screen name="Announcements and News">
    //                     {props => <CardsDisplay {...props} setArticleFunc={setSelectedArticle} articles={newsData}/>}
    //                 </Stack.Screen>
    //                 <Stack.Screen name="Reading">
    //                     {props => <ArticleViewSubpage article={newsData[selectedArticle]}/>}
    //                 </Stack.Screen>
    //             </Stack.Navigator>                  
    //         );
    //     }        
    // } else {
    //     return(
    //         <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    //             <Ionicons name='hourglass-outline' size={100} color='gray'/>
    //             <Text style={{
    //                 textAlign: 'center',
    //                 fontWeight: 'bold',
    //                 fontSize: 15
    //             }}>
    //                 Loading News...
    //             </Text>
    //         </View>
    //     );
    // }
};
export default AnnouncementPage;

const CardsDisplay = (props) => {
    let cards = [];
    let ctr = 0;
    props.articles.forEach(article => {
        cards.push(
            <NewsCard

                key={article.id}
                id={ctr}
                date={article.date.toDate().toDateString()}
                header={article.title}
                teaser={article.teaserText}

                previewImgSrc={article.thumbnail}

                nav={props.navigation}
                setArticleFunc={props.setArticleFunc}
            />
        );
        ctr++;
    });

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
    props.article["attached_images"].forEach(image => {        
        images.push(
            <Image key={String(i)} src={image}
            style={{width: '75%', height: undefined, aspectRatio: 1, margin: 10, borderRadius: 15}}/>            
        );
        i++;
    });    

    return(
        <ScrollView style={style.container}>
            <ImageBackground src={props.article.thumbnail}
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

            <Text style={style.metaData}>Published on {props.article.date.toDate().toDateString()}</Text>
            <Text style={style.metaData}>Uploaded by {props.article.author}</Text>
            
            <Text style={style.body}>{props.article.article}</Text>

            <Text style={{marginTop: 25, fontWeight: 'bold'}}>Attached Images:</Text>
            <View>
                { images }                
            </View>            
        </ScrollView>       
    );
};