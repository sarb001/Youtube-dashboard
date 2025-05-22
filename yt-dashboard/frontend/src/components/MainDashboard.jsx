
import axios from "axios"
import { useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BaseUrl } from "../App";
import { useEffect } from "react";

// search params => accesstoken , refreshtoken

// => stored in localstorage

// => passed in videoid and in others ....

// => after 


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

    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [newcomment, setnewcomment] = useState('');
    const [allcomments, setallcomments] = useState([]);

    const[MainAccesstoken,setMainAccesstoken]  = useState('');
    const Refreshtoken = localStorage.getItem('refreshtoken');
    const Accesstoken  = localStorage.getItem('accesstoken');

    useEffect(() => {

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
    }, [searchParams])

    const NewAccesstoken = async () => {
            const Response = await axios.post(`${BaseUrl}/api/v1/refreshtoken`, {
                Refreshtoken
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        console.log('token response =', Response?.data?.access_token);
        const NewAcctoken = Response?.data?.access_token;
        setMainAccesstoken(NewAcctoken);
        localStorage.setItem('accesstoken', NewAcctoken);
    }


    const VideoHandler = async () => {
        try {
            const VideoResp = await axios.get(`${BaseUrl}/api/v1/videoid`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Accesstoken}`
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

            if (Categoryid && videoid) {
                const Response = await axios.put(`${BaseUrl}/api/v1/contentdetails`, {
                    newTitle, newDesc, Categoryid, videoid
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${MainAccesstoken}`
                    }
                });
                console.log('Response =', Response);
                setNewTitle("");
                setNewDesc("");
            }

        } catch (error) {
            console.log('Response errror =', error);
        }
    }

    const AllCommenthandler = async () => {

        console.log('acc token =',Accesstoken);
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
        console.log('channel id =', channelid);

        // try {
        //     const Response = await axios.post(`${BaseUrl}/api/v1/newcomment`, {
        //         newcomment ,channelid,videoid
        //     } , {
        //         headers : {
        //                'Content-Type' : 'application/json',
        //                'Authorization' : `Bearer ${AccToken}`
        //             }
        //     });
        //     console.log('Response comment =>',Response);
        //     setnewcomment("");
        // } catch (error) {
        //     console.log('new post comment error =',error);
        // }

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
                            <input type="text" placeholder="Enter New title..." value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <input type="text" placeholder="Enter New Desc..." value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
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