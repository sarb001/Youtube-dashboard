import axios from 'axios';
import express from 'express';
const router = express.Router();

import dotenv from 'dotenv';
dotenv.config();


const REDIRECT_URI = process.env.NODE_ENV === 'production' ? process?.env?.BACKEND_AUTH_URL : process?.env?.Redirect_uri
const FRONTEND_URL = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_PROD_URL : 'http://localhost:5173'

const Scope = ['https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/youtube.force-ssl'].join(' ');

router.post('/login', async(req,res) => {
     try {
         console.log('working login here ');
         const OAuthUrl =  `${process.env.AUTH_URL}?client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${Scope}&access_type=offline&prompt=consent`;

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
  
        const { access_token , refresh_token , expires_in } = Resp?.data;
        console.log(' tokens are =',access_token , refresh_token ,expires_in );

        return res.status(200).redirect(`${FRONTEND_URL}/dashboard?accesstoken=${access_token}&refreshtoken=${refresh_token}&expiresin=${expires_in}`)
        
    }catch(error){
        console.log(' callback error =',error);
        return res.status(500).json({
          message : "oAuth Error"
        })
    }
})

router.post('/refreshtoken' , async(req,res) => {
    try {

          const { refresh_token } = req.body;
          console.log('refresh token == ',refresh_token );

          if(!refresh_token){
             return res.status(401).json({
                 message : "Refresh token not Found"
             })
          }
        
        const Response = await axios.post(process.env.Token_url,{
                 grant_type : "refresh_token",
                client_id : process.env.CLIENT_ID,
                client_secret : process.env.CLIENT_SECRET,
                refresh_token : refresh_token ,
        },{ headers : {
             'Content-Type' : 'application/x-www-form-urlencoded',
        } });

        const { access_token , expires_in } = Response?.data;
        console.log('Response refresh token =',{ access_token , expires_in } );

        return res.status(200).json({
            access_token: access_token,
            message : "Fetched Re-fresh token"
        })

    } catch (error) {
        console.log('refresh token error =',error);                                                                         
        return res.status(500).json({
            message : "UnAuthorized Error"
        })
    }
})

router.get('/videoid' , async(req,res) => {
    try {
        
        const AccessToken = req?.headers?.authorization.split('Bearer')[1];
        console.log('acc token =',AccessToken);

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
                id   : 'zhuYZAIKHCQ',
                key  : process.env.API_KEY
            },
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${AccessToken}`
            }
        })

        // console.log('video Response -',VideoRes?.data?.items[0]);
        
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
            console.log('content token =',AccessToken);

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

router.get('/allcomments' , async(req,res) => {
    try {
        
           const AccessToken = req?.headers?.authorization.split('Bearer')[1];
           console.log('acc comment token =',AccessToken);

            if(!AccessToken){
                return res.status(401).json({
                    success : false,
                    message : "UnAuthorized Error"
                })
            }

            const Response  = await axios.get(`${process.env.MAIN_URL}/commentThreads`,{
                params : {
                    part :  'snippet,replies',
                    videoId : 'zhuYZAIKHCQ',
                    key : process.env.API_KEY,
                },
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${AccessToken}`
                }
            });

            // console.log(' All comments Response =',Response?.data);

            const MainComment = Response?.data?.items.map(i  => i?.snippet?.topLevelComment?.snippet?.textOriginal);

            return res.status(200).json({
                allcomments : Response?.data?.items.map(i => ({
                     textOriginal : i?.snippet?.topLevelComment?.snippet?.textOriginal,
                })),
                success : true,
                message : " Fetched Alll Comments "
            })

    } catch (error) {
            console.log(' all comments error =',error);
            return res.status(500).json({
              message : "Unable to get All Comments"
            })
    }
}) 

router.post('/newcomment' , async(req,res) => {
     try {
        
        const {  newcomment , channelid , videoid } = req.body;
        console.log('new coment =',{newcomment ,channelid ,videoid})

           const AccessToken = req?.headers?.authorization.split('Bearer')[1];

            if(!AccessToken){
                return res.status(401).json({
                    success : false,
                    message : "UnAuthorized Error"
                })
            }

            await axios.post(`${process.env.MAIN_URL}/commentThreads`,
                {
                "snippet": {
                    "channelId": channelid,
                    "topLevelComment": {
                        "snippet": {
                            "textOriginal": newcomment
                        }
                    },
                    "videoId": videoid
                }
            },{
                params : {
                    part :  'snippet,replies',
                    key : process.env.API_KEY,
                },
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${AccessToken}`
                }
            });

            return res.status(200).json({
                message : " Comment Posted "
            })

     } catch(error){
            console.log(' new comments error =',error);
            return res.status(500).json({
              message : "Unable to post New Comment"
         })
     }
})


export default router;