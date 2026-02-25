import { useState } from "react";

import { DashboardHeader } from "../../components/DashboardHeader"
import { AddNewPropertyForm } from "./components/AddNewPropertyForm";
import './MyProperties.css';
import './Modal.css';
import houseImage from '../../assets/house.jpg'
export function MyProperties() {
    const [showModal, setShowModal] = useState(false);

    const properties = [
        {
            id: 1,
            address: "123 Main Street, Zagreb, Croatia"
        },
        {
            id: 2,
            address: "45 Ilica Street, Zagreb, Croatia"
        },
        {
            id: 3,
            address: "78 Riva, Split, Croatia"
        },
        {
            id: 4,
            address: "22 Korzo, Rijeka, Croatia"
        },
        {
            id: 5,
            address: "10 Stradun, Dubrovnik, Croatia"
        }
    ];
    return (
        <>
            <DashboardHeader></DashboardHeader>
            <div className="main-content">
                <div className={`properties-list + ${showModal ? "blurred" : ""}`} >
                    <div className="grid-box add-new-property"
                        onClick={() => setShowModal(true)}>
                        +
                    </div>
                    {properties.map(property => (
                        <div className="grid-box">
                            <img className="grid-box-background" src={houseImage} alt="" />
                            <p>
                                {property.id}
                            </p>
                            <p>
                                {property.address}

                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <AddNewPropertyForm showModal={showModal} setShowModal={setShowModal}></AddNewPropertyForm>

                    </div>
                </div>

            )}

        </>
    )
}