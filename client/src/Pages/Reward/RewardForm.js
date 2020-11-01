import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { addNotification } from '../../handler/AlertHandler';

const RewardForm = ({ setRewards }) => {

    const [items, setItems] = useState([]);

    // Fetch list of items
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/api/items`);

                setItems(res.data)
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    // Create dropdown list for items --Reference: https://www.carlrippon.com/drop-down-data-binding-with-react-hooks/
    const itemList = items.map(item => (
        <option key={item.itemid} value={item.itemid}>{item.itemname}</option>
    ))

    const { id } = useParams();
    const [formData, setFormData] = useState({
        itemid: 1,
        quantity: ''
    });

    const { itemid, quantity } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        //Posting the rewards form into the database via calling the post method from rewards api--Reference: https://github.com/axios/axios/issues/86
        const newReward = {
            itemid,
            quantity
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(newReward);
            await axios.post(`/api/rewards/${id}`, body, config);


            const newList = await axios.get(`/api/rewards/${id}`);

            setRewards(newList.data)

            addNotification('Submission complete', 'The reward has been successfully added', 'success')

        } catch (err) {
            console.error(err);
            addNotification('Submission failed', 'Please try again', 'danger')
        }
    };

    return (
        <Fragment>
            <div className="createReward-container">
                <form onSubmit={e => onSubmit(e)}>
                    <div>Select an item<span>*</span></div>
                    <select onChange={e => onChange(e)} name="itemid" value={itemid}>
                        {itemList}
                    </select>
                    <div>Quantity<span>*</span>: </div>
                    <input type="number" onChange={e => onChange(e)} name="quantity" value={quantity} required='required' />
                    <div className='reward-warning'>Quantity must be a number that is greater than 0 and smaller than 21</div>
                    <div className="createReward-btn">
                        <input type="submit" value="Submit" />
                    </div>
                </form>
            </div>
        </Fragment>

    )
}


export default RewardForm;	