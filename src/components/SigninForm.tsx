import React, { useState,  ReactElement } from "react";
import {  useSelector, useDispatch } from "react-redux";
import {AppState}  from '../types'
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {login} from '../redux/actions/auth'

interface RouterProps {
    history: {
        push(url: string): void;
    };
}
const  Signin = (props:RouterProps) : ReactElement => {


  const { isLoggedIn } = useSelector((state:AppState) => state.auth);
  const message = useSelector((state:AppState) => state.message);


  const [userState, setUserState] = useState({
    useremail: "",
    password: "",
    loading: false,
    isLoggedIn,
    message

  })



  function validationSchema() {
    return Yup.object().shape({
      useremail: Yup.string()
        .required("This field is required!")
        .email('Email is invalid'),
      password: Yup.string().required("This field is required!"),
    });
  }

  const dispatch = useDispatch()

  const  handleSignin = async(formValue: { useremail: string; password: string }) => {
    const { useremail, password } = formValue;
    console.log( 'from login form useremail and pass',useremail, password )
    setUserState({ ...userState,
      loading: true
    });
    
    try {
      await dispatch(login(useremail, password ))
      props.history.push("/profile");
      window.location.reload();

    } catch(error){
      setUserState({...userState,
        loading: false,
      });
    }
  }

  const initialValues = {
    useremail: "",
    password: "",
  };

  if (isLoggedIn) {
    <Navigate to="/profile" replace={true} />

  }
  return (
    <div className="col-md-12">
      <div className="card card-container">
        {/* <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          /> */}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="useremail">useremail</label>
              <Field name="useremail" type="text" className="form-control" />
              <ErrorMessage
                name="useremail"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block" disabled={userState.loading}>
                {userState.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  )
}
 

export default Signin