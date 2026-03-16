

function InventoryViewButton({ imageName }) {

    const BACK_PATH = '/src/assets/images/inventory/';

    return <>
        <style>{`
            .inventory-view-btn img {
                width: 150px;
            }
        `}</style>

        <div className={'inventory-view-btn'}>
            <img src={`${BACK_PATH}${imageName}`} alt=""/>
        </div>
    </>
}

export default InventoryViewButton;