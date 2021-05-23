import React, { useState, useEffect } from 'react';
import './Accounts.css';
import { useHistory } from "react-router-dom";
import { db, storage, auth } from './firebase';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login, selectUser } from './features/userSlice';
import { Avatar } from '@material-ui/core';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';

let userId = window.location.pathname.replace('/users/', '');

function Accounts() {

    // const { userId } = useParams();

    const user = useSelector(selectUser);
    let history = useHistory();
    const dispatch = useDispatch();
    const [accountInfo, setAccountInfo] = useState([]);

    useEffect(() => {
        db.collection('users').doc(window.location.pathname.replace('/users/', '')).onSnapshot((snapshot) => {
            setAccountInfo(snapshot.data());
        });
        console.log(accountInfo);
    }, [])

    const revertPage = () => {
        setAccountInfo([]);
        history.goBack();
    }

    return (
        <div className='userCard'>
            <div className='backIcon' className='back-option' onClick={revertPage}>
                <KeyboardBackspaceRoundedIcon />
            </div>
            {
                accountInfo !== [] ? (
                    <div className='account-card'>
                        <Avatar className='account-icon' src={accountInfo?.photoURL}/>
                        <div className='account-card-info'>
                            <h1>{accountInfo.username}</h1>
                            <h2>{accountInfo.email}</h2>
                        </div>
                        <p>
                            {accountInfo.bio}
                        </p>
                    </div>
                ) : (
                    null
                )
            }            
        </div>
    )
}

export default Accounts;
