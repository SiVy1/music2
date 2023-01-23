"use client";
import React, { useState } from "react";
import { Formik, Form, useField, ErrorMessage } from "formik";
import { object, string, ref } from "yup";
import axios from "axios";
const RegisterValidation = object().shape({
  name: string().required("Required"),
  email: string()
    .required("Valid email required")
    .email("Valid email required"),
  password: string()
    .min(8, "Required min 8 characters")
    .required("Required min 8 characters"),
  confirmPassword: string()
    .required("Please confirm your password")
    .oneOf([ref("password")], "Passwords do not match"),
});

const Input = ({ name, label, ...props }: any) => {
  const [field, meta] = useField(name);
  return (
    <div className="register_label">
      <label className="" htmlFor={field.name}>
        {label}
      </label>
      <input
        className={`${
          meta.error && meta.touched ? "input_error" : "register_input"
        } `}
        {...field}
        {...props}
      />
      <ErrorMessage
        name={field.name}
        component="div"
        className="error_message"
      />
    </div>
  );
};
interface errorMessage {
  mess: string;
}
interface registerResponse {
  config: object;
  data: object;
  headers: object;
  requests: object;
  status: number;
}
function App() {
  const [errorMessage, setErrorMessage] = useState<errorMessage>({
    mess: "",
  });
  const handleSubmit = async (values: any) => {
    await axios
      .post("/api/signup", { values: values })
      .then((res: any) => {
        console.log("Successfully registered");
        window.location.replace("/auth/login");
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          setErrorMessage(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  };

  return (
    <div className="register_con">
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={RegisterValidation}
      >
        {() => {
          return (
            <Form className="form_con">
              {errorMessage?.mess}

              <Input name="name" label="Name" />
              <Input name="email" label="Email" />
              <Input name="password" label="Password" type="password" />
              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
              />
              <div className="sumbit_con">
                <button className="submit" type="submit">
                  Register
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default App;
