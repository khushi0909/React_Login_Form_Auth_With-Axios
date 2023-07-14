
import React from 'react'
import {useRef,useState,useEffect} from "react";
import {faCheck ,faTimes,faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon}  from "@fortawesome/react-fontawesome"
import axios from './api/axios';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const REGISTER_URL='/register'
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


const Register = () => {
const userRef = useRef();   //that will allow us to set the focus on the use input ,when the component loads 
const errRef = useRef();            //IF WE GET AN ERROR WE NEED TO FOCUS ON THAT so it can be announced by the screen reader for the accessibility 


const [user ,setUser] = useState('');           //will be tied to the user input 
const [validName,setValidName] = useState(false)        //boolean ,weather the name validated or not 
const [userFocus,setUserFocus] = useState(false)        //boolean ,weaher we are focused on tha input field or not 

const [pwd,setPwd] = useState('');
const [validPwd,setValidPwd] = useState(false)
const [pwdFocus,setPwdFocus] = useState(false)

const [matchPwd,setMatchPwd] = useState('')
const [validMatch,setValidMatch] = useState(false)
const [matchFocus,setMatchFocus] = useState(false)


useEffect(()=>{
    userRef.current.focus();

},[])           ///we apply for setting the focus when the component loads ,thers nothing in the dependency so this will only happen when the component load s and will set the focus on username 

useEffect (() =>{
    const result = USER_REGEX.test(user);
    console.log("usenameregextest",result);
    console.log(user);
    setValidName(result)

},[user])//this will apply to the user name and this is where we validate the user name ,so user state is in the dependency array any time it changes,it will check the validation of that field 

useEffect (()=>{
    const result = PWD_REGEX.test(pwd);
    console.log("pwdregexcheck",result);
    console.log(pwd)
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match)
},[pwd,matchPwd])


useEffect(()=>{
    setErrMsg('');
},[user,pwd,matchPwd])   //for err ms g,when we display an error messsage ,but anytime the user changes the information ,changes the state of oen of 3 ,then we will go ahead and clear out the message 

const [errMsg, setErrMsg] = useState('');
const [success, setSuccess] = useState(false);

const handleSubmit = async (e) => {
        e.preventDefault();
        //here we can consider in submission is only thing preventing or really enforcing our REGEX validation is that submit button and that could actually be hacked if somebosy knew te JS the y can jsut go in the console and grab that button through the selection and enable it and so if you want to be very coautious offcourse  99per of the people wpuldnt do that 
    // but if could put some conditions where we will validate the stae of the user and the password agin so if for some reason the button was enable dan dallowed it to submit ,that wasnt pasing anyway ,it wasnt passing our validation checks we are just checking those again and if either one of those are f and then we are just returning so we dont submit anuthing to our backend that would have the databse where we would actually save a user with invalid information 

    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
        setErrMsg("Invalid Entry");
        return;
                    }
                   try{
                    const  response = await axios.post(REGISTER_URL,

                    //!provide the payload the data you are sending in JSON>Stringify -2 properties destructured -this is because the backend will be expecting the property name user and the property name pwd ,if we have named our state the username we would have to do{user:username,pwd} because the backend must be expecting the user property not the user naem property and if you would have name password as its spelling then it would have been like this as pwd:password 

                    //THird parameter in the post will b e the object  and inside that we need to specify the headers and headers has its own objec t

                    JSON.stringify({user,pwd}),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                    );
                    console.log(response.data);
                    // console.log(response.accessToken);
                    console.log(JSON.stringify(response))
                    setSuccess(true);

                    //!clearinput field if you want to 

                   }catch(err){
                    if (!err?.response) {
                        setErrMsg('No Server Response');
                    } else if (err.response?.status === 409) {
                        setErrMsg('Username Taken');
                    } else {
                        setErrMsg('Registration Failed')
                    }
                    errRef.current.focus();
                }

                   }





  return (
    <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
    <section>
            <p ref={errRef} className={errMsg?"errMsg" : "offscreen"} aria-live = "assertive"> 
                {errMsg}
            </p>       
             {/* //p displayed at the top of the form ,if the errormags state exist then apply the class errmsg which will display error masg otherwise we will apply the class offscreen which will take the whole  p positioned absolutely way off the screen ,but still be available to screen readers instead off dsispaly none and totally gone offf from the screen  */}
            {/* aria live aaertive meeans when we set the focus on this element that as ref of errref it will be announced on the screen with a screen reader  */}
                <h1>Register</h1>
                <form onSubmit = {handleSubmit}>
                    <label htmlFor="username">
                        Username:
                        <span className = {validName ? "valid" :"hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validName || !user ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon = {faTimes}/>

                        </span>
                    </label>
                    <input
                    type='text'
                    id='username'
                    ref={userRef}
                    autoComplete='off'
                    onChange={(e)=>setUser(e.target.value)}//
                    required
                    aria-invalid={validName?"false" : "true"}// will be set to true whrn the comp loads becoz we will not have the vallid username ,this lets the screen reader announce weather the input field needs the adjusted before the form is accepted
                    aria-describedby = "uidnote" //lets us provide the another element that describes the input field ,so a screen reader wll read the label first and will read what type of field the label is addressing here its text .then it will also read th aria-invalid weather it has valid input or not and then it will jump tot he aria described by the element to give a full description and this is where we can put in the requirements ,that our registration form needs and have a screen reader read those 
                    onFocus={()=> setUserFocus(true)}
                    onBlur={ () => setUserFocus(false)} />


                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon = {faInfoCircle}/>
                        4 to 24 characters. <br/>
                        Must begin with a letter .<br/>
                        Letters,numbers,underscores,hyphens allowed .
                    </p>
                    <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                      


                      

                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                </form>

                <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign In</a>
                        </span>
                    </p>
    </section>
            )}
            </>
  )
}

export default Register