import React, { useState, useEffect } from 'react';
import './Login.css'
import { db, auth, storage } from './firebase';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './features/userSlice';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profileUrl, setProfileUrl] = useState('');
    const [textareaVal, setTextareaVal] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const [collectedBio, setCollectedBio] = useState('');

    const createAccount = (e) => {
        if (username === null || textareaVal == '') {
            alert('Please enter valid details')
        } else {
            auth.createUserWithEmailAndPassword(email, password)
            .then((userAuth) => {
                console.log(userAuth.user);
                userAuth.user.updateProfile ({
                    displayName: username,
                    photoURL: profileUrl,
                    username: username,
                })
                db.collection('users').doc(userAuth.user.uid).set({
                    username: username,
                    photoURL: profileUrl,
                    email: email,
                    bio: textareaVal
                })
                .then(() => {
                    dispatch(
                        login({
                            email: userAuth.user.email,
                            uid: userAuth.user.uid,
                            username: username,
                            photoURL: profileUrl,
                            bio: textareaVal,
                        })
                    );
                })
            }).catch((error) => alert(error));
        }
    }

    const loginToApp = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .then((userAuth) => {
            db.collection('users').doc(userAuth.uid).onSnapshot((snapshot) => {
                setCollectedBio(snapshot.data());
                console.log('COLLECTEDBIO', collectedBio);
            })
            console.log(userAuth.additionalUserInfo);
            dispatch(
                login({
                    email: userAuth.user.email,
                    uid: userAuth.user.uid,
                    username: userAuth.user.displayName,
                    photoURL: profileUrl,
                })
            );
        }).catch((error) => alert(error));
    } 

    return (
        <div className='login'>
            <form className='login-form'>
                <h3 className='form-title'>Sign into your Account</h3>
                <input value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} type="text" placeholder='Profile Picture URL (Required if Registering)'/>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder='Username (Required if Registering)'/>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email *'/>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password *'/>
                <textarea value={textareaVal} onChange={(e) => setTextareaVal(e.target.value)} className='loginTextArea' placeholder='Tell us a little about yourself... (Required if Registering)'></textarea>
                <br/>
                <button className='login-btn' type='submit' onClick={loginToApp}>LOGIN</button>
            </form>
            <button className='signup-btn' onClick={createAccount}>SIGN UP</button>
        </div>
    )
}

export default Login;
