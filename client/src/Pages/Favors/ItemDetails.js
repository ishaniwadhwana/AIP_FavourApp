import React, { Fragment, useEffect, useState } from "react";
import '../../handler/ButtonHandler';
import { addNotification } from '../../handler/AlertHandler';
import '../../../node_modules/react-notifications-component/dist/theme.css'
import "./FavorDetails.css";

const ItemDetails = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function getCharacters() {
            try {
                const favorItem = await fetch(`/api/favorItems`);
                const bodys = await favorItem.json();
                setItems(bodys.map(({ itemid, itemname }) => ({ label: itemname, value: itemid })));
            } catch (err) {
                console.error(err.message);
                addNotification('Submission failed', 'Please try again', 'danger')
            }
        }
        getCharacters();
    }, []);


    return (
        <Fragment>
            <option>SELECT OPTION</option>
            {items.map(({ label, value }) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}

        </Fragment>

    );
};

export default ItemDetails;