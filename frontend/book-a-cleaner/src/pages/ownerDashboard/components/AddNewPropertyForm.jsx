import './AddNewPropertyForm.css'
import { X } from 'lucide-react'
import { useForm } from "react-hook-form";
import axios from 'axios';

export function AddNewPropertyForm({ showModal, setShowModal }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();


    const onSubmit = async (data) => {
        //e.preventDefault(); // prevents page reload
        try {
            const response = await axios.post(
                "http://localhost:8000/property/create",
                data
            );
            reset();

            console.log(response.data);

        } catch (err) {
            console.log(data)
            console.error(err);
        }
    };
    return (
        <>
            <div className="add-new-property-form-container">
                <div className='modal-header'>
                    <h2>Add Property</h2>
                    <div className='close-button' onClick={() => setShowModal(false)}><X /></div>
                </div>
                <form className="add-new-property-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className='input-container'>
                        <label>Property Name</label>
                        <input
                            {...register("name", {
                                required: "Property name is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters"
                                }
                            })}
                            placeholder="e.g. Apartment in Zagreb Center"
                        />
                        <div className='form-validation-message'>
                            {errors.name ? errors.name.message : "\u00A0"}
                        </div>
                    </div>


                    <div className='input-container'>
                        <label>Street and number</label>
                        <input
                            {...register("address", {
                                required: "Address is required"
                            })}
                            placeholder="Street and number"
                        />
                        <div className='form-validation-message'>
                            {errors.address ? errors.address.message : "\u00A0"}
                        </div>
                    </div>


                    {/* City */}
                    <div className='input-container'>
                        <label>City</label>
                        <input
                            {...register("city", {
                                required: "City is required"
                            })}
                        />
                        <div className='form-validation-message'>
                            {errors.city ? errors.city.message : "\u00A0"}
                        </div>
                    </div>

                    {/* ZIP */}
                    <div className='input-container'>
                        <label>ZIP Code</label>
                        <input
                            type="number"
                            {...register("zip", {
                                required: "ZIP code is required",
                                pattern: {
                                    value: /^[0-9]{4,6}$/,
                                    message: "Invalid ZIP code"
                                }
                            })}
                        />
                        <div className='form-validation-message'>
                            {errors.zip ? errors.zip.message : "\u00A0"}
                        </div>
                    </div>


                    {/* Property Type */}
                    <div className='input-container'>
                        <label>Property Type</label>
                        <select
                            {...register("property_type", {
                                required: "Please select property type"
                            })}
                        >
                            <option value="">Select type</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="studio">Studio</option>
                        </select>
                        <div className='form-validation-message'>
                            {errors.property_type ? errors.property_type.message : "\u00A0"}
                        </div>
                    </div>

                    {/* Size */}
                    <div className='input-container'>
                        <label>Size (m²)</label>
                        <input
                            type="number"
                            {...register("size", {
                                required: "Size is required",
                                min: {
                                    value: 10,
                                    message: "Size must be at least 10 m²"
                                }
                            })}
                        />
                        <div className='form-validation-message'>
                            {errors.size ? errors.size.message : "\u00A0"}
                        </div>
                    </div>


                    {/* Notes */}
                    <div className='input-container'>
                        <label>Notes</label>
                        <textarea
                            {...register("notes", {
                                maxLength: {
                                    value: 300,
                                    message: "Maximum 300 characters"
                                }
                            })}
                            placeholder="Optional additional information..."
                        />
                        <div className='input-validation-messsage'>

                        </div>
                        {errors.notes ? errors.notes.message : "\u00A0"}
                    </div>



                    <div className='submit-button-container'>
                        <button type='submit' className='submit-button'>Save</button>
                    </div>

                </form>
            </div>
        </>
    )
}