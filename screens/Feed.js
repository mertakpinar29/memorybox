import React, { useState, useEffect} from 'react'
import { View, Text, SafeAreaView, ScrollView, StatusBar } from 'react-native'
import { Header, Input, Card, ListItem, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';

const SearchComponent = ({setIsSearching, setSearchQuery, searchQuery, isSearching}) => {
    const changeSearchStatus = (e) => {setIsSearching(!isSearching)}
    return (
        isSearching ?
        <View style={{flexDirection:'row', width:200, marginRight:15}}>
            <Input key='input' placeholder='Search a memory' placeholderTextColor='#fff' style={{color: '#fff'}} 
            value={searchQuery} 
            onChangeText={(query) => {setSearchQuery(query)}}
            
            />
            <Icon name='times' color={'#fff'} size={20} onPress={() => {
                changeSearchStatus()
                setSearchQuery('')
                }}/>
        </View>
        :
        <Icon name='search' color={'#fff'} size={20} style={{marginRight: 10}} onPress={changeSearchStatus}/>
    )
}

export default function Feed({navigation}) {
    const [isSearching, setIsSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [memories, setMemories] = useState([])

    const fetchMemories = async () => {
        const memoriesCollection = await firestore().collection('memories').get()
        setMemories(
            memoriesCollection.docs.map((doc) => {
                return {...doc.data(), id: doc.id}
            })
        )
    }

    const searchMemory =  (query) => {
        setMemories(memories.filter(memory => memory.title.includes(query)))
    }

    useEffect(() => {
        if(isSearching && searchQuery !== '') {
            searchMemory(searchQuery)
        }else {
            fetchMemories()
        }
    }, [searchQuery])

    useEffect(() => {
        fetchMemories()
        
        firestore().collection('memories').where('type', '==', 'memory').onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                  if (change.type === 'added') {
                    console.log('New memory: ', change.doc.data());
                  }
                  if (change.type === 'modified') {
                    console.log('Modified memory: ', change.doc.data());
                  }
                  if (change.type === 'removed') {
                    console.log('Removed memory: ', change.doc.data());
                  }
                  fetchMemories()
            })
        })
    }, [])
    
    const deleteMemory = async (id) => {
        const res = await firestore().collection('memories').doc(id).delete()
        console.log(res)
        fetchMemories()
    }

    return (
        <SafeAreaView style={{flex: 1, paddingTop: StatusBar.currentHeight}}>
            <Header 
            placement='left'
            centerComponent={{text: 'MEMORIES',style:{color:'#fff', marginTop:2}}}
            leftComponent={{icon: 'book', color:'#fff'}}
            rightComponent={<SearchComponent isSearching={isSearching} setIsSearching={setIsSearching} setSearchQuery={setSearchQuery} searchQuery={searchQuery} />}
            />
            <ScrollView style={{marginHorizontal: 20}}>
                {
                    memories.map((memory) => {
                        return (
                            <Card key={memory.id}>
                                <Card.Title style={{fontSize: 21, color: 'red'}}>{memory.title}</Card.Title>
                                <Card.Divider />
                                <Card.Image resizeMode='cover' style={{width: 300, height: 200}} source={{uri: memory.fileUrl}} />
                                <Text style={{marginVertical: 10}}>{memory.content}</Text>
                                <Text style={{fontWeight: 'bold', marginBottom: 12}}>Author: {memory.author}</Text>
                                <Card.Divider />
                                {
                                    auth().currentUser?.uid === memory.createdBy ?
                                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                                        <Text>{memory.likes.length} likes</Text>
                                        <Icon name='pencil' color={'blue'} size={20} onPress={(e) => {navigation.navigate('Edit', {
                                            memoryToEdit: memory
                                        })}}/>
                                        <Icon name='trash' color={'red'} size={20} onPress={(e) => {deleteMemory(memory.id)}}/>
                                    </View>
                                    :
                                    <View>
                                            <Text>{memory?.likes?.length}</Text>
                                            {
                                              memory?.likes?.includes(auth().currentUser?.uid) ? 
                                              <Icon name='thumbs-up' color='blue' onPress={async (e) => {
                                                await firestore().collection('memories').doc(memory.id).update({
                                                    ...memory,
                                                    likes: memory?.likes?.filter(element => element !== auth().currentUser?.uid)
                                                })
                                                fetchMemories()
                                              }} />
                                              :
                                              <Icon name='thumbs-o-up' color='black' onPress={async (e) => {
                                                  await firestore().collection('memories').doc(memory.id).update({
                                                      ...memory,
                                                      likes: [...memory.likes, auth().currentUser?.uid]
                                                  })
                                                  fetchMemories()
                                              }}/> 
                                            }      
                                    </View>
                                }
                            </Card>
                        )
                    })
                }
            </ScrollView>
        </SafeAreaView>
    )
}
