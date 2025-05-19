import axios from "axios"
import { BaseUrl } from "../App";

const Login = () => {


    const Googleloginhandler = async() => {
        try {
            const Res = await axios.post(`${BaseUrl}/api/v1/login`,{},{
                headers : {
                    'Content-Type' : 'application/json',
                }
            })
            console.log('Respo -',Res);
            window.location.href = Res?.data?.url
        } catch (error) {
            console.log('error -',error)
        }
    }

    return (
        <>
         <div> 
            <h3> Youtube Mini - Dashboard </h3>
            <button onClick={Googleloginhandler}> Login with Google </button>
         </div>
        </>
    )
}


export default Login