import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { useForm } from "react-hook-form";

import { FaBroom } from "react-icons/fa";

import "./Register.css"

export function Register() {
    const navigate=useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ mode: "onBlur" });

    const password = watch("password");

    const onSubmit = async (data) => {
        const registrationData={
            email:data.email,
            password:data.password,
            role:data.role
        }

        const response = await axios.post("http://localhost:8000/auth/register",registrationData)
        console.log(response)
        navigate("http://localhost:8000/auth/login");
    };

    return (
        <div className="register-form-container">
            <div className="logo-container">
                <div className="logo">
                    <FaBroom size={42} />
                </div>
                <p>
                    Book a cleaner
                </p>
            </div>
            <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-container">
                    <input
                        type="text"
                        {...register("name",
                            { required: "Name is required" })
                        }
                        placeholder="First Name"
                    />
                    <div className="form-validation-message">
                        {errors.name ? errors.name.message : "\u00A0"}

                    </div>

                </div>
                <div className="input-container">
                    <input
                        type="text"
                        {...register("surname",
                            { required: "Surname is required" })
                        }
                        placeholder="Last Name"
                    />
                    <div className="form-validation-message">
                        {errors.surname ? errors.surname.message : "\u00A0"}

                    </div>

                </div>



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

                <div>
                    <div className='role-radio-buttons-description'>
                        Intended usage:
                    </div>
                    <label>
                        <input
                            type="radio"
                            value="owner"
                            {...register("role", { required: "Choose a role" })}
                        />
                        Owner
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="cleaner"
                            {...register("role", { required: "Choose a role" })}
                        />
                        Cleaner
                    </label>
                    <div className="form-validation-message">
                        {errors.role ? errors.role.message : "\u00A0"}
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

                {/* Confirm Password */}
                <div className="input-container">
                    <input
                        type="password"
                        {...register("confirmPassword", {
                            required: "Please confirm password",
                            validate: (value) =>
                                value === password || "Passwords do not match",
                        })}
                        placeholder="Confirm password"
                    />
                    <div className="form-validation-message">
                        {errors.confirmPassword ? errors.confirmPassword.message : "\u00A0"}
                    </div>
                </div>

                <button className="register-button" type="submit">Register</button>
            </form>

        </div>
    );
}
