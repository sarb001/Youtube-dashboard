import axios from "axios"

const Login = () => {

    const BaseUrl = import.meta.env.VITE_API_BASE_URL;
    console.log('base url is =',BaseUrl);

    const Googleloginhandler = async() => {
        try {
            const Res = await axios.post(`${BaseUrl}/api/v1/login`)
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