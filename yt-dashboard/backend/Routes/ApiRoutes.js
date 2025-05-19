import axios from 'axios';
import express from 'express';
const router = express.Router();

const REDIRECT_URI = process.env.NODE_ENV === 'production' ? process.env.BACKEND_AUTH_URL : process.env.Redirect_uri

const FRONTEND_URL = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_PROD_URL : 'http://localhost:5173'


router.post('/login', async(req,res) => {
     try {
         console.log('working login here ');
         const OAuthUrl =  `${process.env.AUTH_URL}?client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${process.env.Scope}&access_type=offline&prompt=consent`;

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
           redirect_uri: REDIRECT_URI,
           grant_type : 'authorization_code',
        }, { headers : { 'Content-Type' : 'application/json' }})
  
        const { access_token , refresh_token } = Resp?.data;
        console.log(' tokens are =',access_token , refresh_token);


        return res.status(200).redirect(`${FRONTEND_URL}/dashboard?accesstoken=${access_token}&refreshtoken=${refresh_token}`)
        
    }catch(error){
        console.log(' callback error =',error);
        return res.status(500).json({
          message : "oAuth Error"
        })
    }
})

router.get('/videoid' , async(req,res) => {
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

router.put('/contentdetails' , async(req,res) => {
        try {

             const AccessToken = req?.headers?.authorization.split('Bearer')[1];

            if(!AccessToken){
                return res.status(401).json({
                    activeaccesstoken : false,
                    success : false,
                    message : "UnAuthorized Error"
                })
            }

            const Body = req.body;
            console.log('body data =',Body);

            const VideoRes = await axios.put(`${process.env.MAIN_URL}/videos` , {
                "id" : Body?.videoid,
                "snippet" : {
                    "title" : Body?.newTitle,
                    "description" : Body?.newDesc,
                    "categoryId" : Body.Categoryid
                }
            },{
                params : {
                    part :  'snippet,contentDetails,statistics',
                    id : 'zhuYZAIKHCQ',
                    key : process.env.API_KEY
                },
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${AccessToken}`
                }
            });

            console.log('Response updated =',VideoRes);

            return res.status(200).json({
                success : true,
                message : " Video Title updated "
            })

        }catch(error){
            console.log('content error =',error);
            return res.status(500).json({
              message : "Unable to change New Title"
            })
        }
})

export default router;