
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

router.get('/newone', async(req,res) => {
     try {
        console.log('working newone ');
          return res.status(200).json({
            message : "Ending here new "
        })
    } catch (error) {
        console.log('working here',error);
     }
})

export default router;