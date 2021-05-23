import React, { useState } from 'react';
import './Join.css';
import { useHistory, Link } from 'react-router-dom';

function Join() {

    const [meetingID, setMeetingID] = useState(null);

    return (
        <div className='join-page'>
            <h2>Join a Meeting</h2>
            <input type="text" placeholder='Meeting ID' value={meetingID} onChange={(e) => setMeetingID(e.target.value)}/>  
            {
                meetingID != null || meetingID != '' ? (
                    <center>
                        <Link to={`/meeting/${meetingID}`}><button className='main-join-btn'>JOIN</button></Link>
                    </center>
                ) : (
                    null
                )
            }
        </div>
    )
}

export default Join;
