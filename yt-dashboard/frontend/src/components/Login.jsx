import axios from "axios"

const Login = () => {

    const Googleloginhandler = async() => {
        try {
            const Res = await axios.post('/api/v1/login')
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