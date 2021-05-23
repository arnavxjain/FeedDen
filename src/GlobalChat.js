import React, { useState, useEffect, useRef } from 'react';
import './GlobalChat.css';
import Message from './Message';
import { selectUser } from './features/userSlice';
import { useSelector } from 'react-redux';
import SendIcon from '@material-ui/icons/Send';
import { db, storage } from './firebase';
import firebase from 'firebase';
import ImageIcon from '@material-ui/icons/Image';

function GlobalChat() {

    const user = useSelector(selectUser);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [image, setImage] = useState(null);
    const [imagePlaceholder, setImagePlaceholder] = useState('');

    useEffect(() => {
        db.collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
            console.log('THIS', snapshot)
          setMessages(snapshot.docs.map(doc => ({
            id: doc.id,
            message: doc.data()
          })));
          console.log('MESSAGES', messages);
          document.getElementById('messagesDiv').scrollTop = document.getElementById('messagesDiv').scrollHeight;
        })
    }, []);

    const checkForSubmit = (e) => {
        if (e.which == 13 && newMessage != '' || e.keyCode == 13 && newMessage != '') {
            sendMessage();
        }
    }

    const sendMessage = () => {
        if (newMessage != '' && image === null) {
            let date = new Date();

            let AmOrPm = date.getHours() >= 12 ? 'PM' : 'AM';
    
            let currentTime = date.getMinutes();
    
            if (currentTime < 10) {
                currentTime = `0${date.getMinutes()}`
            }
    
            let currentHour = date.getHours();
    
            if (currentHour < 10) {
                currentHour = `0${date.getHours()}`
            }
    
            if (image !== null) {
                const imageUpload = storage.ref(`messageImages/${image.name}`).put(image);

                imageUpload.on(
                    "state_changed",
                    () => {
                        storage
                            .ref("messageImages")
                            .child(image.name)
                            .getDownloadURL()
                            .then(url => {
                                db.collection('messages').add({
                                    myUid: user.uid,
                                    message: newMessage,
                                    messagePhotoUrl: url,
                                    username: user.username,
                                    time: `${currentHour}:${currentTime} ${AmOrPm}`,
                                    userPhotoUrl: user.photoURL,
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                }); 
                            setNewMessage('');
                            setImagePlaceholder('No Image Selected');
                            setImage(null);
                        });
                    }
      );
            } else {
                db.collection('messages').add({
                    myUid: user.uid,
                    message: newMessage,
                    username: user.username,
                    messagePhotoUrl: null,
                    time: `${currentHour}:${currentTime} ${AmOrPm}`,
                    userPhotoUrl: user.photoURL,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
                setNewMessage('');
            }
        } 
        
        else if (newMessage == '' && image !== null) {
            let date = new Date();

            let AmOrPm = date.getHours() >= 12 ? 'PM' : 'AM';
    
            let currentTime = date.getMinutes();
    
            if (currentTime < 10) {
                currentTime = `0${date.getMinutes()}`
            }
    
            let currentHour = date.getHours();
    
            if (currentHour < 10) {
                currentHour = `0${date.getHours()}`
            }

            const imageUpload = storage.ref(`messageImages/${image.name}`).put(image);

            imageUpload.on(
                "state_changed",
                () => {
                    storage
                        .ref("messageImages")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            db.collection('messages').add({
                                myUid: user.uid,
                                message: newMessage,
                                messagePhotoUrl: url,
                                username: user.username,
                                time: `${currentHour}:${currentTime} ${AmOrPm}`,
                                userPhotoUrl: user.photoURL,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            }); 
                        setNewMessage('');
                        setImagePlaceholder('No Image Selected');
                        setImage(null);
                    });
                }
            );
        }
    }

    const imageFileChange = (e) => {
        setImage(e.target.files[0]);
        setImagePlaceholder(e.target.files[0].name);
    }

    return (
        <div className='globe'>
            <h2 className='globe-title'>Group Chat</h2>
            <div className="global-chat-area">
                <div className="messages-box" id='messagesDiv'>
                    {
                        messages.map(({ id, message }) => (
                            <Message
                                myUid={message.myUid} 
                                messagePhotoUrl={message.messagePhotoUrl}
                                key={id}
                                message={message.message}
                                time={message.time}
                                username={message.username}
                                userPhotoUrl={message.userPhotoUrl}
                            />
                        ))
                    }
                </div>
                <div className="message-controls">
                    <input type="text" onKeyPress={checkForSubmit} placeholder='Type a message...' value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                    <label for="file-upload" class="custom-file-upload">
                    <ImageIcon className='img-btn'/>
                    </label>
                    <input onChange={imageFileChange} accept="image/x-png,image/gif,image/jpeg" id="file-upload" type="file"/>
                    <SendIcon  className='send-btn' onClick={sendMessage}/>
                </div>
                {
                    image !== null ? (
                        <h4 className='img-holder'>{imagePlaceholder}</h4>
                    ) : (
                        <h4 className='img-holder'>No Image Selected</h4>
                    )
                }
            </div>
        </div>
    )
}

export default GlobalChat;
