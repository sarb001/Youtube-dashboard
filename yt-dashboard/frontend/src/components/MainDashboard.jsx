import axios from "axios"
import { useState } from "react";
import {  useSearchParams } from 'react-router-dom';
import { BaseUrl } from "../App";

const MainDashboard = () => {

    const [searchParams] = useSearchParams();

    const AccToken = searchParams.get('accesstoken');
    const RefToken = searchParams.get('refreshtoken');

    localStorage.setItem('acctoken',AccToken);
    localStorage.setItem('refreshtoken',RefToken);

    const[Title,setTitle] = useState('');
    const[Desc,setDesc] = useState('');
    const[Categoryid,setCategoryid] = useState('');
    const[videoid,setvideoid] = useState('');
    const[channelid,setchannelid] = useState('');
    const[videoimg,setvideoimg] = useState(null);

    const[newTitle,setNewTitle] = useState('');
    const[newDesc,setNewDesc] = useState('');

    const[newcomment,setnewcomment] = useState('');
    const[allcomments,setallcomments] = useState([]);

    // write comment and reply it
    /// delete comment as well

    const VideoHandler = async() => {
        try {
            const VideoResp = await axios.get(`${BaseUrl}/api/v1/videoid`,{
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${AccToken}`
                }
            })
            console.log('VideoResp =',VideoResp?.data?.videoinfo);
            setTitle(VideoResp?.data?.videoinfo?.snippet?.title);
            setDesc(VideoResp?.data?.videoinfo?.snippet?.description);
            setvideoimg(VideoResp?.data?.videoinfo?.snippet.thumbnails?.default?.url);
            setchannelid(VideoResp?.data?.videoinfo?.snippet?.channelId)
            setCategoryid(VideoResp?.data?.videoinfo?.snippet?.categoryId);
            setvideoid(VideoResp?.data?.videoinfo?.id);

        } catch (error) {
             console.log('video resp error-',error);
        }
    }

    const DetailsChangeHandler = async() => {
        try {

            if(Categoryid && videoid){
                const Response = await axios.put(`${BaseUrl}/api/v1/contentdetails`,{
                    newTitle,newDesc,Categoryid,videoid
                },{
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${AccToken}`    
                    }
                });
                console.log('Response =',Response);
                setNewTitle("");
                setNewDesc("");
            }

       }catch(error) {
          console.log('Response errror =',error);
        }
    }

    const AllCommenthandler = async() => {

        try {
            const Response = await axios.get(`${BaseUrl}/api/v1/allcomments`,{
                  headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${AccToken}`
                  }
            });

            console.log('Response =',Response?.data?.allcomments);
            setallcomments(Response?.data?.allcomments);

        } catch (error) {
            console.log('error =',error);
        }
    }

    const newcommenthandler = async() => {
        console.log('channel id =',channelid);

        try {
            const Response = await axios.post(`${BaseUrl}/api/v1/newcomment`, {
                newcomment ,channelid,videoid
            } , {
                headers : {
                       'Content-Type' : 'application/json',
                       'Authorization' : `Bearer ${AccToken}`
                    }
            });
            console.log('Response comment =>',Response);
            setnewcomment("");
        } catch (error) {
            console.log('new post comment error =',error);
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
                    <div style = {{margin:'15px'}}>
                        <h3> Title is - {Title} </h3>
                        <div>
                            <input type = "text" placeholder = "Enter New title..." value = {newTitle} 
                            onChange={(e) => setNewTitle(e.target.value)}
                            />
                         </div>
                         <div>
                            <input type = "text" placeholder = "Enter New Desc..." value = {newDesc} 
                            onChange={(e) => setNewDesc(e.target.value)}
                            />
                           </div>
                        <div style = {{padding:'10px'}}>
                            <button onClick={DetailsChangeHandler}> Change Title & Desc </button>
                        </div>
                    </div>
                        <h3> Description is - {Desc} </h3>
                </div>

                <div>
                        <h3> All Comments </h3>
                        <div>
                            <button onClick={AllCommenthandler}> Get All Comments </button>
                        </div>
                        <div>
                            {allcomments?.map((i,index) => {
                                return (
                                    <div key = {index}> 
                                      {i?.textOriginal}  
                                    </div>
                                )
                            })}
                        </div>
                </div>

                <div>
                    <h3> Add New Comment </h3>
                    <div>
                            <input type = "text" placeholder="Enter new comment" 
                            value={newcomment} onChange={(e) => setnewcomment(e.target.value)}
                            />
                     </div>
                     <div style = {{paddingTop:'4%'}}>
                       <button onClick={newcommenthandler}> Add New Comment </button>
                     </div>
                </div>
            
            </div>
           </div>
        </div>
    )
}

export default MainDashboard