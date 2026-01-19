import { Link } from "react-router-dom";

import { Header } from '../../components/Header';

import './LandingPage.css';


export function LandingPage() {

    return (
        <>
            <Header></Header>
            <div className='banner'>
                <p className='banner-text'>
                    CLEANINGS SCHEDULED PERFECTLY BETWEEN EVERY GUEST
                </p>
            </div>
            <div className='register'>
                <div className='register-message'>
                    Get started and register today:
                </div>
                <Link>
                    <div className='register-link'>
                        Click here and register
                    </div>
                </Link>
            </div>

        </>
    )
}
