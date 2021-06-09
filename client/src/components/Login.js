import Button from '@material-ui/core/Button';
import '../css/login.css';

export default function Login(){


    function handleGoogleClick()
    {
        window.location.href = "/auth/google";
    }

    return <div className="login-page-div">
        <div className="login-page">
        <div className="title"><h1>Welcome to Couplove!</h1></div>
        <Button variant="contained" onClick={handleGoogleClick} id="home-login-btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="g-logo"/>
            &nbsp;&nbsp;Login With Google</Button>
        </div>
    </div>
}