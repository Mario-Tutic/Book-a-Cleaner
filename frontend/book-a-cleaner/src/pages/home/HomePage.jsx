import { Link,Navigate } from "react-router-dom";


import { Header } from '../../components/Header';
import { useAuth } from "../../AuthContext";

import './HomePage.css';


export function HomePage() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <>
            <Header></Header>
            <div className='banner'>
                <p className='banner-text'>
                    CLEANINGS SCHEDULED PERFECTLY BETWEEN EVERY GUEST
                </p>
            </div>
            <div>
                <h1>Hello user:{user.email}</h1>
                
            </div>

        </>
    )
}
