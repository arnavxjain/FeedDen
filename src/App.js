import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './App.css';
import Feed from './Feed';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Input } from '@material-ui/core';
import { db, storage, auth } from './firebase';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { logout, login, selectUser } from './features/userSlice';
import Login from './Login';
import GlobalChat from './GlobalChat';
import CancelIcon from '@material-ui/icons/Cancel';
import Search from './Search';
import ImageIcon from '@material-ui/icons/Image';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Accounts from './Accounts';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import EditPage from './EditPage';
import Videocall from './Videocall';
import Join from './Join';
import Meeting from './Meeting';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme) => (console.log(theme), {
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: 'rgb(21,32,43)',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    animation: 'modal-animation 0.4s',
    transition: 'all 0.2s ease-in',
  },
  mandatorySpan: {
    color: 'var(--main-app-color)',
    // fontSize: '15px'
  },
  subDiv: {
    color: 'white',
    padding: '10px'
  },
  messagePaper: {
    position: 'absolute',
    width: '86vw',
    height: '80vh',
    backgroundColor: 'rgb(21,32,43)',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    animation: 'modalAnimation 0.4s'
  }
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [textArea, setTextArea] = useState('');
  const [image, setImage] = useState(null);
  const [accountInfo, setAccountInfo] = useState()
  const [newPostModalState, setNewPostModalState] = useState(false); 
  const [accountModalState, setAccountModalState] = useState(false); 
  const [globalChatState, setGlobalChatState] = useState(false); 
  const [searchState, setSearchState] = useState(false); 
  const [collectedBio, setCollectedBio] = useState('');

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    
    auth.onAuthStateChanged((userAuth) => {
      setAccountInfo(userAuth);
      if (userAuth) {
        db.collection('users').doc(userAuth.uid).onSnapshot((snapshot) => {
          setCollectedBio(snapshot.data());
          console.log('COLLECTEDBIO', collectedBio);
        })
        console.log('Auto Sign IN', userAuth);
        dispatch(login({
          email: userAuth.email,
          uid: userAuth.uid,
          photoURL: userAuth.photoURL,
          username: userAuth.displayName,
          bio: collectedBio.bio,
        }));
      } else {
        dispatch(logout());
      }
    })
  }, [])

  const newPost = (e) => {
    let date = new Date();
    let AmOrPm = date.getHours() < 12 ? 'AM' : 'PM';
    console.log('THIS', db.collection('posts').onSnapshot(snap => snap.docs.map(doc => console.log(doc.data()))));               
    if (image !== null) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
          "state_changed",
          () => {
              storage
                  .ref("images")
                  .child(image.name)
                  .getDownloadURL()
                  .then(url => {
                    db?.collection('posts').add({
                      myUid: user.uid,
                      timestamp: `${date.getHours()}:${date.getMinutes()} ${AmOrPm}`,
                      username: user.username,
                      postPhotoUrl: url,
                      userPhotoUrl: user.photoURL || '',
                      message: textArea
                    });   
              });
              setNewPostModalState(false);
          }
      );
    } else {
      db.collection('posts').add({
        myUid: user.uid,
        timestamp: `${date.getHours()}:${date.getMinutes()} ${AmOrPm}`,
        username: user.username,
        postPhotoUrl: null,
        userPhotoUrl: user.photoURL || '',
        message: textArea,
      }); 
      setNewPostModalState(false);
    }
    
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  const logoutOfApp = () => {
    dispatch(logout())
    auth.signOut();
  }

  return (
    <div className="app">
      {
        !user ? (
          <Login />
        ) : (
          <div className='app-body'>
           <Router>

             <Switch>

              <Route path='/'>
                
              </Route>

             </Switch>

           <Switch>           
                <Route path="/home">
                <Sidebar 
                  newPostClick={() => setNewPostModalState(true)} 
                  accountClick={() => setAccountModalState(true)}
                  globeChatClick={() => setGlobalChatState(true)}
                  searchClick={() => setSearchState(true)}
                />
                  <Modal className='modal' open={newPostModalState} onClose={() => setNewPostModalState(false)} >
                      <div style={modalStyle} className={classes.paper}>
                      <CancelIcon className='cancelModalIcon' onClick={() => setNewPostModalState(false)}/>
                        <h2 className='modal-title'>New Post</h2>
                        <div className="modal-main">
                          <span>Add Message*</span>
                          <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)} className='modalTextArea' placeholder="What's your message?"></textarea>
                          <label for="file-upload" class="custom-file-upload">
                            <ImageIcon className='img-btn'/>
                            <span className='file-span'>Add an Image</span>
                          </label>
                          <input onChange={handleImageChange} accept="image/x-png,image/gif,image/jpeg" id="file-upload" type="file"/>
                          <button onClick={newPost}>POST</button>
                        </div>
                      </div>
                    </Modal>

                    <Modal className='modal' open={accountModalState} onClose={() => setAccountModalState(false)}>
                      <div style={modalStyle} className={classes.paper}>
                      <CancelIcon className='cancelModalIcon' onClick={() => setAccountModalState(false)}/>
                        <center>
                          <h3 className='modal2-title'>Account Information</h3>
                        </center>
                        <div className={classes.subDiv}>
                          <Avatar src={user.photoURL} className='account-info-img'/>
                          <span>Date of Creation: <span className={classes.mandatorySpan}>{accountInfo?.multiFactor.a.metadata.creationTime}</span></span><br/>
                          <span>UserName: <span className={classes.mandatorySpan}>{user.username}</span></span><br/>
                          <span>Email ID: <span className={classes.mandatorySpan}>{user.email}</span></span>
                        </div>
                        <center>
                          <Link to={`/profile/edit/${user.uid}`}><button className='bio-btn'>EDIT</button></Link>
                          <button className='logout-btn' onClick={logoutOfApp}>LOG OUT</button>
                        </center>
                      </div>
                    </Modal>

                    <Modal className='modal' open={globalChatState} onClose={() => setGlobalChatState(false)}>
                      <div style={modalStyle} className={classes.messagePaper}>
                        <CancelIcon className='cancelModalIcon' onClick={() => setGlobalChatState(false)}/>
                        <GlobalChat />
                      </div>
                    </Modal>     

                    <Modal className='modal' open={searchState} onClose={() => setSearchState(false)}>
                      <div style={modalStyle} className={classes.messagePaper}>
                        <CancelIcon className='cancelModalIcon' onClick={() => setSearchState(false)}/>
                        <Search />
                      </div>
                    </Modal> 

                    <Feed />
                </Route>    
           </Switch>

           <Switch>
                
                <Route path="/profile/edit/:userUID">
                  <EditPage />
                </Route>

            </Switch>
            
           <Switch>
                
                <Route path="/users/:roomId">
                  <Accounts />
                </Route>

            </Switch>

            <Switch>

                <Route path="/videocall/:roomId">

                  <Videocall />

                </Route>

            </Switch>

            <Switch>

                <Route path="/meetings/join">

                  <Join />

                </Route>

            </Switch>

            <Switch>

              <Route path="/meeting/:roomId">

                <Meeting />

              </Route>

            </Switch>

           </Router>
          </div>
        )
      }
    </div>
  );
}

export default App;
