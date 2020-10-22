import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios';

// import './RewardItemList.css';

const RewardItemList = (requestid) => {

    const id = requestid.requestid

    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/api/rewards/${id}/total`);

                setRewards(res.data)
                // console.log(res.data)	
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    return (
        <Fragment>
            <div className='rewardItemList-container'>
                {rewards.map((reward, index, { length }) => (
                    index + 1 !== length ? `${reward.itemname} x ${reward.total}, ` : `${reward.itemname} x ${reward.total}`
                ))}
            </div>
        </Fragment>
    )
}


export default RewardItemList