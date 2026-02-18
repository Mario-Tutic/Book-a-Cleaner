import { DashboardHeader } from '../../components/DashboardHeader'
import { useAuth } from "../../AuthContext";

import './OwnerDashboard.css';
import { MapPinHouse,CalendarCheck } from "lucide-react";

import houseImage from '../../assets/house.jpg'


export function OwnerDashboard() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }
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
            <div>
                <p className='section-title'>
                    Upcoming Cleanings
                </p>
            </div>
            <div className='main-content'>
                <div>
                
                </div>
                <div className='upcoming-cleanings-list'>
                {properties.map(property => (
                    <div key={property.id} className='cleaning'>
                        <div className='property-image-container'>
                            <img className='property-image' src={houseImage} alt="" />

                        </div>
                        <div className='cleaning-info'>
                            <div className='property-name'>
                                Love house

                            </div>
                            <div className='property-address'>
                                <MapPinHouse size={20}/>
                                {property.address}

                            </div>
                            <div className='cleaning-date'>
                                <CalendarCheck size={20}/>
                                14 feb

                            </div>

                        </div>
                    </div>
                ))}
            </div>

            </div>

        </>

    )

}