import axios from 'axios';
import express from 'express';
const router = express.Router();

router.get('/testingendpoint', async(req,res) => {
     try {
        console.log('testingendpoint ');
        return res.status(200).json({
            message : "Ending here"
        })
    } catch (error) {
        console.log('working here',error);
     }
});

router.post('/login', async(req,res) => {
     try {
         console.log('working login here ');
         const OAuthUrl =  `${process.env.AUTH_URL}?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.Redirect_uri}&response_type=code&scope=${process.env.Scope}&access_type=offline&prompt=consent`;

        console.log('Auth url is -',OAuthUrl);
        return res.json({  url : OAuthUrl })
        
    } catch (error) {
        console.log('working here',error);
        return res.status(500).json({
                message : "Redirected to Consent Screen"
        })
     }
})

router.get('/callbackurl' , async(req,res) => {
    try {
           const code = req.query.code;
        console.log('code query -',code);
  
        const Resp = await axios.post(process.env.Token_url,
          {
           code,
           client_id : process.env.CLIENT_ID,
           client_secret : process.env.CLIENT_SECRET,
           redirect_uri: process.env.Redirect_uri,
           grant_type : 'authorization_code',
        }, { headers : { 'Content-Type' : 'application/json' }})
  
        const { access_token , refresh_token } = Resp?.data;
        console.log(' tokens are =',access_token , refresh_token);


        return res.status(200).redirect(`http://localhost:5173/dashboard?accesstoken=${access_token}&refreshtoken=${refresh_token}`)
        
    }catch(error){
        console.log(' callback error =',error);
        return res.status(500).json({
          message : "oAuth Error"
        })
    }
})

router.post('/videoid' , async(req,res) => {
    try {
        
        const AccessToken = req?.headers?.authorization.split('Bearer')[1];

         if(!AccessToken){
            return res.status(401).json({
                activeaccesstoken : false,
                success : false,
                message : "UnAuthorized Error"
            })
        }

        const VideoRes = await axios.get(`${process.env.MAIN_URL}/videos` , {
            params : {
                part :  'snippet,contentDetails,statistics',
                id : 'zhuYZAIKHCQ',
                key : process.env.API_KEY
            },
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${AccessToken}`
            }
        })

        console.log('Response -',VideoRes?.data?.items[0]);
        
        return res.status(200).json({
            videoinfo : VideoRes?.data?.items[0],
            success : true,
            message : "Video Details Fetched"
        })

    } catch (error) {
         console.log(' video error =',error);
        return res.status(500).json({
          message : "Specific Video Error"
        })
    }
})

export default router;