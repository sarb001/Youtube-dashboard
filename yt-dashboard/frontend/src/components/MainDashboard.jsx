import axios from "axios"
import { useState } from "react";
import {  useSearchParams } from 'react-router-dom';

const MainDashboard = () => {

    const [searchParams] = useSearchParams();

    const AccToken = searchParams.get('accesstoken');
    const RefToken = searchParams.get('refreshtoken');

    localStorage.setItem('acctoken',AccToken);
    localStorage.setItem('refreshtoken',RefToken);

    // const[videoDetails,setVideoDetails] = useState('');

    const[Title,setTitle] = useState('');
    const[Desc,setDesc] = useState('');

    const[videoimg,setvideoimg] = useState(null);

    // change title ,desc
    // image
    // write comment and reply it
    /// delete comment as well

    const VideoHandler = async() => {
        try {
            const VideoResp = await axios.post('/api/v1/videoid',{},{
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${AccToken}`
                }
            })
            console.log('VideoResp =',VideoResp?.data?.videoinfo);
            setTitle(VideoResp?.data?.videoinfo?.snippet?.title);
            setDesc(VideoResp?.data?.videoinfo?.snippet?.description);
            setvideoimg(VideoResp?.data?.videoinfo?.snippet.thumbnails?.default?.url);

            console.log('title is -',Title);
            console.log('desc is -',Desc);

        } catch (error) {
             console.log('video resp error-',error);
        }
    }

    return (
        <div>
           <h2> Welcome to Personlized Youtube Dashboard </h2>
            <div>
                <button onClick={VideoHandler}> Fetch Video Details </button>
           <div style = {{padding:'25px'}}>
                <div>
                    <div> <img src = {videoimg} alt = "videoimage" /> </div>
                        <h3> Title is - {Title} </h3>
                        <h3> Description is - {Desc} </h3>
                </div>
             
            </div>
           </div>
        </div>
    )
}

export default MainDashboard