import axios from "axios"
import {  useSearchParams } from 'react-router-dom';

const MainDashboard = () => {

    const [searchParams] = useSearchParams();

    const AccToken = searchParams.get('accesstoken');
    const RefToken = searchParams.get('refreshtoken');
    console.log('AccToken -',AccToken);
    console.log('RefToken -',RefToken);

    localStorage.setItem('acctoken',AccToken);
    localStorage.setItem('refreshtoken',RefToken);

    const VideoHandler = async() => {
        try {
            const VideoResp = await axios.post('/api/v1/videoid',{},{
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${AccToken}`
                }
            })
            console.log('VideoResp =',VideoResp?.data?.videoinfo);
        } catch (error) {
             console.log('video resp error-',error);
        }
    }

    return (
        <div>
           <h2> Welcome to Personlized Youtube Dashboard </h2>
           <div>
             <button onClick={VideoHandler}> Fetch Video Details </button>
           </div>
           <div>
              
           </div>
        </div>
    )
}

export default MainDashboard