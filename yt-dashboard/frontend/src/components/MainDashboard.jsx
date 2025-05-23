
import axios from "axios"
import { useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BaseUrl } from "../App";
import { useEffect } from "react";


const MainDashboard = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [Videodetails, setVideodetails] = useState({
        Title: "",
        Desc: "",
        Categoryid: "",
        channelid: "",
        videoimg: null,
        videoid: ""
    });

    const[formData,setformData] = useState({
            newTitle : "",
            newDesc  : "",
    })

    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [newcomment, setnewcomment] = useState('');
    const [allcomments, setallcomments] = useState([]);

    const[MainAccesstoken,setMainAccesstoken]    = useState('');
    const[MainRefreshtoken,setMainRefreshtoken]  = useState('');
    
        const { newDesc , newTitle } = formData;
        const { channelid ,  videoid } = Videodetails;

    useEffect(() => {
        const Accesstoken  = localStorage.getItem('accesstoken');
        setMainAccesstoken(Accesstoken);
        const Refreshtoken = localStorage.getItem('refreshtoken');
        setMainRefreshtoken(Refreshtoken);

        const AccToken = searchParams.get('accesstoken');
        const RefToken = searchParams.get('refreshtoken');
        const Expire   = searchParams.get('expiresin');

        if (AccToken && RefToken) {
            localStorage.setItem('accesstoken', AccToken);
            localStorage.setItem('refreshtoken', RefToken);

            if (Expire > 0) {        // 65 > 0 // token is valid 
                setisAuthenticated(true);
                const timeout = setTimeout(() => {
                    NewAccesstoken();
                }, Expire * 1000);
                return () => clearTimeout(timeout);
            } else {
                setisAuthenticated(false);
                navigate('/')
            }

        } else {
            navigate('/')
        }
    }, [MainAccesstoken,searchParams]);

    const NewAccesstoken = async () => {           
            const Response = await axios.post(`${BaseUrl}/api/v1/refreshtoken`, {
               refresh_token : MainRefreshtoken
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        console.log(' new token response =', Response?.data?.access_token);
        const NewAcctoken = Response?.data?.access_token;
        setMainAccesstoken(NewAcctoken);
        localStorage.setItem('accesstoken', NewAcctoken);
    }


    const VideoHandler = async () => {
        try {
            const VideoResp = await axios.get(`${BaseUrl}/api/v1/videoid`, {
                headers: {
                    'Content-Type'  : 'application/json',
                    'Authorization' : `Bearer ${MainAccesstoken}`
                }
            })
            console.log('VideoResp =', VideoResp?.data?.videoinfo);

            const Mainsnippet = VideoResp?.data?.videoinfo?.snippet;
            const Mainvideoid = VideoResp?.data?.videoinfo?.id;

            setVideodetails({
                Title: Mainsnippet?.title,
                Desc: Mainsnippet?.description,
                Categoryid: Mainsnippet?.categoryId,
                channelid: Mainsnippet?.channelId,
                videoimg: Mainsnippet?.thumbnails?.default?.url,
                videoid: Mainvideoid
            })

        } catch (error) {
            console.log('video resp error-', error);
        }
    }

    const DetailsChangeHandler = async () => {
        try {


            if (Videodetails?.channelid && Videodetails?.videoid) {
                const Response = await axios.put(`${BaseUrl}/api/v1/contentdetails`, {
                    newTitle, newDesc, channelid, videoid
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${MainAccesstoken}`
                    }
                });
                console.log('Response details =', Response);
                setformData(({
                    newTitle : "",
                    newDesc  : ""
                }));
            }

        } catch (error) {
            console.log('Response errror =', error);
        }
    }

    const AllCommenthandler = async () => {

            if(isAuthenticated){
                try {
                const Response = await axios.get(`${BaseUrl}/api/v1/allcomments`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${MainAccesstoken}`
                    }
                });

                console.log('Response =', Response?.data?.allcomments);
                setallcomments(Response?.data?.allcomments);
                
            } catch (error) {
                console.log('error =', error);
            }
    }
    }

    const newcommenthandler = async () => {
        try {
            const Response = await axios.post(`${BaseUrl}/api/v1/newcomment`, {
                newcomment ,channelid,videoid
            } , {
                headers : {
                       'Content-Type' : 'application/json',
                       'Authorization' : `Bearer ${MainAccesstoken}`
                    }
            });
            console.log('Response comment =>',Response);
            setnewcomment("");
        } catch (error) {
            console.log('new post comment error =',error);
        }

    }

    const handlechange = (e) => {
        setformData({  ...formData ,[e.target.name] : e.target.value })
    }

    return (
        <div>
            <h2> Welcome to Personlized Youtube Dashboard </h2>
            <div>
                <button onClick={VideoHandler}> Fetch Video Details </button>
                <div style={{ padding: '25px' }}>
                    <div>
                        <div>
                            <div key={Videodetails?.videoid} style={{ margin: '15px' }}>
                                <div> <img src={Videodetails?.videoimg} alt="videoimage" /> </div>
                                <h3> Title is  {Videodetails?.Title} </h3>
                                <h4>  Desc is = {Videodetails?.Desc} </h4>
                            </div>
                        </div>

                        <div>
                            <input type="text" placeholder="Enter New title..." 
                               name = "newTitle"
                              value = {formData?.newTitle}
                              onChange={handlechange}
                            />
                        </div>

                        <div>
                            <input type="text" placeholder="Enter New Desc..." 
                                name = "newDesc"
                                value = {formData?.newDesc}
                                onChange={handlechange}
                            />
                        </div>

                        <div style={{ padding: '10px' }}>
                            <button onClick={DetailsChangeHandler}> Change Title & Desc </button>
                        </div>

                    </div>
                </div>

                <div>
                    <h3> All Comments </h3>
                    <div>
                        <button onClick={AllCommenthandler}> Get All Comments </button>
                    </div>
                    <div>
                        {allcomments?.map((i, index) => {
                            return (
                                <div key={index}>
                                    {i?.textOriginal}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h3> Add New Comment </h3>
                    <div>
                        <input type="text" placeholder="Enter new comment"
                            value={newcomment} onChange={(e) => setnewcomment(e.target.value)}
                        />
                    </div>
                    <div style={{ paddingTop: '4%' }}>
                        <button onClick={newcommenthandler}> Add New Comment </button>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default MainDashboard