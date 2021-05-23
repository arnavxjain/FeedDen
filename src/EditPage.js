import React, { useState, useEffect } from 'react';
import './EditPage.css';
import { useHistory, useParams } from "react-router-dom";
import { db, storage, auth } from './firebase';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login, selectUser } from './features/userSlice';
import { Avatar } from '@material-ui/core';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

function EditPage() {    

    const [myAccountInfo, setMyAccountInfo] = useState([]);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    let history = useHistory();
    const [newUserName, setNewUserName] = useState(user.username);
    const [newBio, setNewBio] = useState(user.bio);
    const [newPhotoURL, setNewPhotoURL] = useState(user.photoURL);

    useEffect(() => {
        db.collection('users').doc(window.location.pathname.replace('/profile/edit/', '')).onSnapshot((snapshot) => {
            setMyAccountInfo(snapshot.data());
        });
        console.log(myAccountInfo);
        setNewBio(myAccountInfo.bio);
    }, [window.location])

    const revertPage = () => {
        history.goBack();
    }

    const saveChanges = () => {
        db.collection('users').doc(window.location.pathname.replace('/profile/edit/', '')).update({
            bio: newBio,
            username: newUserName
        });
        document.getElementById('notification').style.display = 'block';
        setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
        }, 3000)
        dispatch(login({
            username: newUserName,
            email: user.email,
            photoURL: newPhotoURL,
            uid: user.uid,
            bio: newBio,
        }));
    }

    return (
        <div className='edit-page'>
             <div className='backIcon' className='back-option' onClick={revertPage}>
                <KeyboardBackspaceRoundedIcon />
            </div>
            <h1 className='edit-page-header'>Edit Account Details</h1>
            <div className="account-info">
                <div className="account-info-two">
                    <Avatar src={myAccountInfo.photoURL} className='user-icon'/>
                    <h3 className='username-holder'>USERNAME <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)}/></h3>
                    <h3 className='email-holder'>EMAIL ID<span>{myAccountInfo.email}</span></h3>
                    <h3 className='image-holder'>IMAGE URL <input type="text" value={newPhotoURL} onChange={(e) => setNewPhotoURL(e.target.value)}/></h3>
                </div>
            </div>
           <textarea className='newBioInput' placeholder='Edit your bio' value={newBio} onChange={(e) => setNewBio(e.target.value)}></textarea>
           <button className='save-btn' onClick={saveChanges}>SAVE CHANGES</button>
           <div className='notification' id="notification">
                <span><CheckCircleIcon className='check-icon'/> Changes saved successfully</span>
           </div>
        </div>
    )
}

export default EditPage;
