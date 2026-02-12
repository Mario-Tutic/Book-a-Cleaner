import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { useAuth } from "../../AuthContext";


import { FaBroom } from "react-icons/fa";

import './Auth.css'

export function Login() {
    const navigate = useNavigate()
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onBlur" });
    const onSubmit = async (loginData) => {
        try {
            // Prepare form-data for OAuth2PasswordRequestForm
            const formData = new URLSearchParams();
            formData.append("username", loginData.email); // OAuth2 expects 'username'
            formData.append("password", loginData.password);

            const response = await axios.post(
                "http://localhost:8000/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true, // if backend sets cookies
                }
            );
            const token = response.data.access_token;

            login(response.data.user, token);

            console.log(response.data);
            navigate("/home"); // React route, not backend URL
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };



    return (
        <div className="auth-form-container">
            <div className="logo-container">
                <div className="logo">
                    <FaBroom size={42} />
                </div>
                <p>
                    Book a cleaner
                </p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>

                <div className="input-container">
                    <input
                        type="email"
                        {...register("email",
                            { required: "Email is required" })
                        }
                        placeholder="Email"
                    />
                    <div className="form-validation-message">
                        {errors.email ? errors.email.message : "\u00A0"}

                    </div>
                </div>


                {/* Password */}
                <div className="input-container">
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Min 6 characters",
                            },
                        })}
                        placeholder="Password"
                    />
                    <div className="form-validation-message">
                        {errors.password ? errors.password.message : "\u00A0"}
                    </div>

                </div>

                <button className="register-button" type="submit">Login</button>
            </form>

        </div>
    );
}