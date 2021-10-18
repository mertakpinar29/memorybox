import React, {useState, useEffect} from 'react'
import { View, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Text } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import * as ImagePicker from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import LinearGradient from 'react-native-linear-gradient';

export default function EditScreen({navigation, route}) {
    const { memoryToEdit } = route.params
    const user = auth().currentUser
    const memoryId = memoryToEdit.id
    const [memory,setMemory] = useState({
        title: memoryToEdit.title,
        content: memoryToEdit.content,
        author: memoryToEdit.author,
        createdBy: user?.uid,
        type: 'memory',
        fileUrl: memoryToEdit.fileUrl
    })
    const [image, setImage] = useState(null)
    const [uploading, setUploading] = useState(false)

    const selectImage = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        ImagePicker.launchImageLibrary(options, response => {
            if(response.errorMessage || response.errorCode) {
                Alert.alert(
                    "Something went wrong",
                    `${response?.errorCode} ${response?.errorMessage}`,
                    [
                        {
                            text: 'OK',
                            style: 'cancel'
                        }
                    ]
                )
            }else if(response.didCancel) {
                console.log('cancelled')
            }
            else {
                const source = { uri: response.assets[0].uri}
                setImage(source)
            }
        })
    }

    const resetForm = () => {
        setMemory({
            title: '',
            content: '',
            author: '',
        })
    }

    const updateMemory = async (memory) => {
        if(image) {
            try {
                const { uri } = image 
                const filename = uri.substring(uri.lastIndexOf('/') + 1)
                const uploadUri = uri
        
                const task = storage().ref(filename).putFile(uploadUri)
                var fileUrl = null
        
                try {
                    setUploading(true)
                    await task
                    fileUrl = await storage().ref(filename).getDownloadURL()
                    console.log(fileUrl)
                } catch (error) {
                    console.log(error)
                }
        
                setImage(null)
                await firestore().collection('memories').doc(memoryId).update({
                    ...memory,
                    fileUrl
                })
                setUploading(false)
                resetForm()
                navigation.navigate('Feed')
            } catch (error) {
                console.log(error.message)
            }
        }else {
            try {
                await firestore().collection('memories').doc(memoryId).update(memory)
                resetForm()
                navigation.navigate('Feed')
            } catch (error) {
                console.log(error.message)
                console.log(memory.id)
            }
        }
        
    }

    return (
        <View style={{flex: 1, justifyContent:'center', paddingHorizontal: 15}}>
            <Text style={{textAlign:'center', marginBottom: 15}} h1>Update a memory</Text>
            <Input value={memory.title} onChangeText={(title) => { setMemory({...memory, title: title})}} placeholder='Title' leftIcon={{ type: 'font-awesome', name: 'header'}} />
            <Input  value={memory.content} onChangeText={(content) => { setMemory({...memory, content: content})}} placeholder='Content' leftIcon={{ type: 'font-awesome', name: 'pencil'}} />
            <Input  value={memory.author} onChangeText={(author) => { setMemory({...memory, author: author})}} placeholder='Author' leftIcon={{ type: 'font-awesome', name: 'user'}} />
            <Button
              onPress={selectImage}
              icon={
                image ? 
                <Icon
                  name="check"
                  size={15}
                  color="white"
                  style={{marginRight:5}}
                />
                :
                <Icon
                  name="upload"
                  size={15}
                  color="white"
                  style={{marginRight:5}}
                />
              }
              title={ image ? '' : 'Select an image'}
              ViewComponent={LinearGradient} // Don't forget this!
              linearGradientProps={{
                colors: ['red', 'pink'],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
              }}
            />
            <Text></Text>
                <Button style={{marginTop: 15}} title='UPDATE' onPress={() => {updateMemory(memory)}} />
        </View>
    )
}
