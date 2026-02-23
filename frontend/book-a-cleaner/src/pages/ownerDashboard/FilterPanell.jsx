import './FilterPanell.css';

export function FilterPanell() {
    return (
        <>
            <div className='filter-pannel'>
                <p className='filter-section-title'>Filter By:</p>
                <div className='radio-buttons'>
                    <div className='radio-button'>
                        Property name
                    </div>
                    <div className='radio-button'>
                        Status
                    </div>

                </div>

            </div>

        </>
    )
}