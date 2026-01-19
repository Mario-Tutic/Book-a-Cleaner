import { Link } from "react-router-dom";

import { FaBroom } from "react-icons/fa";

import './Header.css'

export function Header(){
    return(
        <>
            <div className='header glass'>
                <div className='left-section'>
                    <div className="logo">
                        <FaBroom size={42} />
                    </div>
                    <Link>Pricing</Link>
                    <Link>About</Link>
                    <Link>Contact us</Link>
                    <Link>Pricing</Link>
                </div>
                <div className='right-section'>
                    <Link>Sign in</Link>
                </div>
            </div>
        
        </>
    )
}