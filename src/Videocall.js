import React, { useState, useEffect } from 'react';
import './Videocall.css';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useHistory, Link } from 'react-router-dom';
import { DocumentPage } from 'twilio/lib/rest/sync/v1/service/document';

function Videocall() {

    let history = useHistory();
    const [videoStatePlaceholder, setVideoStatePlaceholder] = useState('Turn Video Off');

    const copyURLtoClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        document.getElementById('notification').style.display = 'block';
        setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
        }, 3000)
    }

    const copyMeetingIDtoClipboard = () => {
        navigator.clipboard.writeText(window.location.pathname.replace('/videocall/', ''));
        document.getElementById('notification').style.display = 'block';
        setTimeout(() => {
        document.getElementById('notification').style.display = 'none';
        }, 3000)
    }

    const getVideoPreview = () => {
        let video = document.getElementById('video-preview-div');
        console.log('VIDEO', video)
        navigator.getUserMedia = navigator.getUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, handleIncomingVideoPreview, videoPreviewError);
        }
    }

    const handleIncomingVideoPreview = (stream) => {
        let video = document.getElementById('video-preview-div');
        video.srcObject = stream;
        video.play();
    }

    const videoPreviewError = (e) => {
        console.log('VIDEO ERROR', e);
    }

    const toggleVideo = (e) => {
        let video = document.getElementById('video-preview-div');

        let thisParent = e.target.parentElement.classList;
        let entireClassName = thisParent.value;

        console.log(entireClassName);
        if (entireClassName.includes('active')) {
            thisParent.remove('active');
            video.srcObject = null;
            setVideoStatePlaceholder('Turn Video On');
        } else {
            thisParent.add('active');
            getVideoPreview();
            setVideoStatePlaceholder('Turn Video Off');
        }
    }

    getVideoPreview();
    // addSwitching();

    return (
        <div className='videocall'>
            <h3 className='info-header'>Here's the link to your Video Call... You can share it with the other participants for them to join.</h3>
            <div className="copy-head">
                <h4 className='copy-code-div'>{window.location.href}</h4><span title="Copy Meeting URL" onClick={copyURLtoClipboard}><FileCopyIcon /></span>
            </div>
            <h3 className='info-header'>Meeting ID</h3>
            <div className="copy-head">
                <h4 className='copy-code-div'>{window.location.pathname.replace('/videocall/', '')}</h4><span title="Copy Meeting URL" onClick={copyMeetingIDtoClipboard}><FileCopyIcon /></span>
            </div>
           <div className="mid-main">
           <h2 style={{ textAlign: 'center', }}>Video Preview</h2>
                <div className="video-preview" style={{ borderRadius: '10px' }}>
                    <video id='video-preview-div'></video>
                </div>
                <h3 style={{ textAlign: 'center', color: ' rgb(29,161,242)', transition: 'all 0.2s ease-in', }}>{videoStatePlaceholder}</h3>
                <div className="toggle-button active">
                    <div className="inner-circle" onClick={toggleVideo}>

                    </div>
                </div>
                <div className="start-options-div">
                    <button onClick={() => history.goBack()}>LEAVE</button>
                    <Link className='main-link-div' to={`/videocall/start/${window.location.pathname.replace('/videocall/', '')}`}><button>START MEETING</button></Link>
                </div>
           </div>
            <div className='notification' id="notification">
                <span><CheckCircleIcon className='check-icon'/> Copied to Clipboard</span>
           </div>
            <div className="join-div">
               <Link className='main-join' to={`/meetings/join`}><button className='join-btn'>JOIN A MEETING</button></Link>
            </div>
        </div>
    )
}

export default Videocall;
