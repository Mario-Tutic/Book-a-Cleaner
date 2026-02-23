import { DashboardHeader } from "../../components/DashboardHeader"
import './MyProperties.css'

export function MyProperties() {
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
                <div className="properties-list">
                    <div className="grid-box add-new-property">
                            +
                    </div>
                    {properties.map(property => (
                        <div className="grid-box">
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

        </>
    )
}