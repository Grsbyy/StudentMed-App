import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, Alert, Button } from 'react-native';
import { TouchableHighlight, TouchableOpacity, ImageBackground } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import FailScreen from './misc/fail_screen';
import LoadingScreen from './misc/loading_screen';
import TicketViewer from './misc/ticketviewer';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limitToLast, onSnapshot, query, refEqual, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { firebaseStorage, firestore } from '../services/firebase';
import { launchImageLibrary } from 'react-native-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Stack = createStackNavigator();
const AWMain = (props) => {
    const [articleData, setArticleData] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);

    return (
        <Stack.Navigator>
            <Stack.Screen name='Article Writer ADMIN'>
                {props2 => props.userData != null ?
                    <AWHome
                        setArticleData={setArticleData}
                        setSelectedArticle={setSelectedArticle}
                        articleData={articleData}
                        nav={props2.navigation} /> : null
                }
            </Stack.Screen>
            <Stack.Screen name='Article Writer Compose'>
                {props2 => props.userData != null ?
                    <AWCompose
                        isEditing={selectedArticle != null}
                        article={selectedArticle}
                        userData={props.userData}
                        nav={props2.navigation} /> : null
                }
            </Stack.Screen>
        </Stack.Navigator>
    );
}
export default AWMain;

const AWHome = (props) => {
    const [articlesLoaded, setArticlesLoaded] = useState(false);

    const styles = StyleSheet.create({
        button: {
            margin: 5, padding: 15,
            borderRadius: 15,

            backgroundColor: 'gray',

            flexDirection: 'row',

            justifyContent: 'left',
            alignItems: 'center'
        },
        orangeButton: {
            margin: 10,

            backgroundColor: '#ff6347',

            justifyContent: 'center',
            alignItems: 'center'
        },
        buttonLabel: {
            color: 'white',

            fontWeight: 'bold',
            fontSize: 20,

            margin: 5
        },
        regularLabel: {
            color: 'white',
            margin: 5,
            fontWeight: 'bold'
        },
        headingText: {
            textAlign: 'center',
            fontSize: 15,
        },
    });

    const fetchArticles = async () => {
        try {
            const unsub = onSnapshot(collection(firestore, 'news'),
                (qSnap) => {
                    const data = qSnap.docs.map(dSnap => ({
                        ...dSnap.data(), id: dSnap.id
                    }));

                    props.setArticleData(data);
                });
        } catch (err) {
            console.error(err);
            Alert.alert("Failed to fetch your articles!", err);
        }
    }
    useEffect(() => {
        fetchArticles();
    }, []);

    const articleButtons = [];
    props.articleData.forEach(article => {
        articleButtons.push(
            <TouchableOpacity onPress={() => {
                props.setSelectedArticle(article);
                props.nav.navigate('Article Writer Compose');
            }} key={article.id}>
                <View style={[styles.button]}>
                    <Ionicons name='mail' size={30} color={'white'} />
                    <Text style={styles.regularLabel}>{article.title}</Text>
                </View>
            </TouchableOpacity>
        );
    });

    return (
        <ScrollView style={{ height: '100%' }}>
            <TouchableOpacity onPress={async () => {
                props.setSelectedArticle(null);
                props.nav.navigate('Article Writer Compose');
            }}>
                <View style={[styles.button, styles.orangeButton]}>
                    <Ionicons name='add-circle' size={35} color={'white'} />
                    <Text style={styles.buttonLabel}>Publish a new article</Text>
                </View>
            </TouchableOpacity>
            <ScrollView>
                <View>
                    <Text style={styles.headingText}>Published Articles</Text>
                    <View>
                        {articleButtons}
                    </View>
                </View>
            </ScrollView>
        </ScrollView>
    );
};

const AWCompose = (props) => {
    const [article_Title, setArticleTitle] = useState(props.isEditing ? props.article.title : '');
    const [article_Author, setArticleAuthor] = useState(props.isEditing ? props.article.author : props.userData.displayName);
    const [article_Body, setArticleBody] = useState(props.isEditing ? props.article.content : '');
    const [article_Teaser, setArticleTeaser] = useState(props.isEditing ? props.article.teaserText : '');
    const [article_Thumbnail_URI, setArticleThumbnail] = useState(props.isEditing ? props.article.thumbnail : null);
    const [article_AttachedImages_URIs, setAttachedImages] = useState(props.isEditing ? props.article.attached_images : []);

    const styles = StyleSheet.create({
        containerBox: {
            backgroundColor: 'gray',
            borderRadius: 15,

            padding: 15, margin: 10,

            justifyContent: 'center'
        },
        h1: {
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 25,
            color: 'white',

            marginBottom: 15
        },
        label: {
            color: 'white',
            textAlign: 'left',
            fontSize: 15,
        },
        manipContainer: {
            flexDirection: 'row'
        },
        manipButton: {
            borderRadius: 5,
            backgroundColor: '#b3b3b3',
            padding: 10, width: '40%', margin: '5%'
        },
        textInput: {
            backgroundColor: '#4a4a4a',
            padding: 5,
            borderRadius: 5,
            color: 'white',
            marginBottom: 10
        },
        signStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            color: 'white',
            textAlign: 'center'
        }
    });

    const attachedImages = [];
    article_AttachedImages_URIs.forEach(uri => {
        attachedImages.push(
            <Image key={uri} source={{
                uri: uri
            }}
                style={{
                    width: '80%',
                    height: undefined,
                    aspectRatio: 1,
                    borderRadius: 15,
                }} />
        )
    });

    return (
        <ScrollView style={{ height: '100%' }}>
            <View style={styles.containerBox}>
                <Text style={styles.h1}>{props.isEditing ? 'Edit an article' : 'Publish an article'}</Text>
                <Text style={[styles.h1, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]}>Title:</Text>
                <TextInput
                    style={styles.textInput}
                    value={article_Title}
                    onChangeText={(e) => {
                        setArticleTitle(e);
                    }}
                />
                <Text style={[styles.h1, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]}>Author:</Text>
                <TextInput
                    style={styles.textInput}
                    value={article_Author}
                    onChangeText={(e) => {
                        setArticleAuthor(e);
                    }}
                />
                <Text style={[styles.h1, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]}>Teaser text:</Text>
                <TextInput
                    style={styles.textInput}
                    value={article_Teaser}
                    onChangeText={(e) => {
                        setArticleTeaser(e);
                    }}
                />
                <Text style={[styles.h1, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]}>Article body (multiline):</Text>
                <TextInput
                    style={styles.textInput}
                    value={article_Body}
                    multiline
                    onChangeText={(e) => {
                        setArticleBody(e);
                    }}
                />
                <Text style={[styles.h1, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]}>Thumbnail:</Text>
                {article_Thumbnail_URI != null ?
                    <Image source={{
                        uri: article_Thumbnail_URI
                    }}
                        style={{
                            width: '100%',
                            height: undefined,
                            aspectRatio: 1.75,
                            borderRadius: 15,
                        }} />
                    :
                    <TouchableOpacity onPress={async () => {
                        launchImageLibrary({
                            mediaType: 'photo'
                        }, (response) => {
                            if (response.didCancel)
                                return;

                            uploadBytes(ref(firebaseStorage, 'article-images/thumbnails/' + Math.floor(new Date().getTime() / 1000) + '.jpg'),
                                new Promise((resolve, reject) => {
                                    const xhr = new XMLHttpRequest();
                                    xhr.onload = function () {
                                        resolve(xhr.response);
                                    };
                                    xhr.onerror = function (e) {
                                        reject(new TypeError("Getting image failed."));
                                    }
                                    xhr.responseType = 'blob';
                                    xhr.open("GET", response.assets[0].uri, true);
                                    xhr.send(null);
                                })).then((snapshot) => {
                                    getDownloadURL(snapshot.ref).then(url => {
                                        setArticleThumbnail(response.assets[0].uri);
                                        console.log(url);
                                    });
                                })
                        });
                    }}
                        style={[styles.containerBox, { backgroundColor: '#b3b3b3' }]}>
                        <Text style={[styles.h1, { marginBottom: 0 }]}>Upload Image</Text>
                    </TouchableOpacity>
                }
                <Text style={[styles.h1, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]}>Attached Images ({article_AttachedImages_URIs.length}):</Text>
                {attachedImages}
                <TouchableOpacity onPress={async () => {
                    launchImageLibrary({
                        mediaType: 'photo'
                    }, (response) => {
                        if (response.didCancel)
                            return;

                        uploadBytes(ref(firebaseStorage, 'article-images/attached/' + Math.floor(new Date().getTime() / 1000) + '.jpg'),
                            new Promise((resolve, reject) => {
                                const xhr = new XMLHttpRequest();
                                xhr.onload = function () {
                                    resolve(xhr.response);
                                };
                                xhr.onerror = function (e) {
                                    reject(new TypeError("Getting image failed."));
                                }
                                xhr.responseType = 'blob';
                                xhr.open("GET", response.assets[0].uri, true);
                                xhr.send(null);
                            })).then((snapshot) => {
                                getDownloadURL(snapshot.ref).then(url => {
                                    setAttachedImages(oldVal => { return [...oldVal, response.assets[0].uri]; });
                                });
                            })
                    });
                }}
                    style={[styles.containerBox, { backgroundColor: '#b3b3b3' }]}>
                    <Text style={[styles.h1, { marginBottom: 0 }]}>Add Image</Text>
                </TouchableOpacity>
                {
                    article_Title.length > 0 &&
                        article_Author.length > 0 &&
                        article_Teaser.length > 0 &&
                        article_Body.length > 0 &&
                        article_Thumbnail_URI != null ?
                        <TouchableOpacity onPress={async () => {
                            setDoc(doc(firestore, 'news/', props.isEditing ? props.article.id : Math.floor(new Date().getTime() / 1000).toString()), {
                                title: article_Title,
                                thumbnail: article_Thumbnail_URI,
                                teaserText: article_Teaser,
                                date: Timestamp.fromDate(new Date()),
                                content: article_Body,
                                author: article_Author,
                                attached_images: article_AttachedImages_URIs
                            }, { merge: true });

                            props.nav.navigate('Article Writer ADMIN');
                        }}
                            style={[styles.containerBox, { backgroundColor: 'white' }]}>
                            <Text style={[styles.h1, { marginBottom: 0, color: 'black' }]}>{props.isEditing ? 'PUBLISH CHANGES' : 'PUBLISH'}</Text>
                        </TouchableOpacity>
                        :
                        null
                }
                {props.isEditing ?
                    <TouchableOpacity onPress={async () => {
                        Alert.alert(
                            'Are you sure you want to delete this article?',
                            'Do you want to approve or deny this?', [
                            {
                                text: 'DELETE', onPress: async () => {
                                    //On Approve
                                    deleteDoc(doc(firestore, 'news/', props.article.id));
                                    props.nav.navigate('Article Writer ADMIN');
                                }
                            },
                            {
                                text: 'No', onPress: async () => {
                                }
                            },
                        ])
                    }}
                        style={[styles.containerBox, { backgroundColor: '#ff5959' }]}>
                        <Text style={[styles.h1, { marginBottom: 0, color: 'white' }]}>DELETE POST</Text>
                    </TouchableOpacity>
                    : null}
            </View>
        </ScrollView>
    )
}