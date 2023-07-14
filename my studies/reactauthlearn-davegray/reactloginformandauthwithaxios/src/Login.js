import React from 'react'
import {useRef , useState ,useEffect} from 'react'

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async(e) => {


        e.preventDefault();
    }


  return (
    <section>

        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>

        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}            //putting user value and making it controlled input ,this is imp when we want to clear this form and you will definately do this 
                            required
                        />
        <label htmlFor="passwrod">Passwrod:</label>
                        <input
                            type="password"
                            id="passwrod"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}            //putting user value and making it controlled input ,this is imp when we want to clear this form and you will definately do this 
                            required
                        />
                        <button>Sign In</button>
        


            </form>

            <p>
                        Need an Account?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign Up</a>
                        </span>
                    </p>
    </section>
  )
}

export default Login