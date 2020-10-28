import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RewardItem from './Rewarditem';
import RewardForm from './RewardForm';
import Pagination from '../../handler/PageHandler';

const Rewards = ({ displayRewardsForm }) => {
    const { id } = useParams();

    const [rewards, setRewards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rewardsPerPage] = useState(10);
    let [isLoggedIn, setIsLoggedIn] = useState(false)



    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/api/rewards/${id}`);

                setRewards(res.data)

            } catch (err) {
                console.error(err);
            }
            try {
                await axios.get(`/api/auth/check_login`)
                setIsLoggedIn(true)

            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id, isLoggedIn]);

    const lastReward = currentPage * rewardsPerPage;
    const firstReward = lastReward - rewardsPerPage;
    const currentList = rewards.slice(firstReward, lastReward);
    const paginate = pageNumber => setCurrentPage(pageNumber);


    const currentRewards = currentList.map(reward => (
        <RewardItem
            key={reward.rewardid}
            rewardid={reward.rewardid}
            item={reward.itemname}
            quantity={reward.quantity}
            user={reward.username}
            userid={reward.userid} />
    ))

    return (
        <Fragment>
            <hr />
            <div className="reward-h3">Current Rewards</div>
            <table className="reward-table">
                <thead>
                    <tr className="reward-tr">
                        <th className="reward-th">Item</th>
                        <th className="reward-th">Quantity</th>
                        <th className="reward-th">Rewarder</th>
                        {isLoggedIn && <th className="reward-th">Action</th>}
                    </tr>
                </thead>
                <tbody>{currentRewards}</tbody>
            </table>
            <Pagination
                itemsPerPage={rewardsPerPage}
                totalItems={rewards.length}
                paginate={paginate} />
            <hr />
            {displayRewardsForm && <RewardForm setRewards={setRewards} />}
        </Fragment>
    )
}


export default Rewards
