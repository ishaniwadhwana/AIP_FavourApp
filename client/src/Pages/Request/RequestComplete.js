import React, { Fragment, useState } from 'react'
import axios from 'axios';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { addNotification } from '../../handler/AlertHandler';


const RequestComplete = () => {
    //request id
    const { id } = useParams();

    let history = useHistory();
    const [state, setState] = useState({
        file: null
    });

    const { file } = state;

    const onChange = e => {
        setState({ file: e.target.files[0] });
    }


    const onSubmit = async e => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('photo', file);
            console.log("form data from react: ", file)
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            await axios.get(`/api/requests/${id}/completed`);

            await axios.post(`/api/file/request/${id}`, formData, config);

            await axios.post(`/api/requests/${id}`)
                .then(async () => {
                    // Fetch the data of the completed request
                    const results = await axios.get(`/api/requests/${id}/completed`);
                    const favors = results.data;
                    const config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }

                    // Store the reward as the favor item
                    favors.map(async (favor) => {
                        const newFavor = await axios.post(`/api/favors/lender`, favor, config);
                        const newFavorId = newFavor.data.data.user.favorid;
                        await axios.post(`/api/favors/${newFavorId}/items`, favor, config);
                    })
                })
            addNotification('Submission complete', 'The task has been completed! We have added this as a favor', 'success')

            history.push(`/profile`);

        } catch (err) {
            console.error(err.message);
            // addNotification('Submission failed', 'Please try again!', 'danger')

            const errorMsg = err.response.data.msg
            if (errorMsg.includes("Requester")) {
                addNotification('Submission failed', 'Requester cannot complete their own request!', 'danger')
            } else if (errorMsg.includes("Photo")) {
                addNotification('Submission failed', 'Please upload a photo!', 'danger')
            } else if (errorMsg.includes("Reward")) {
                addNotification('Submission failed', 'There is no reward!', 'danger')
            }
            else {
                addNotification('Submission failed', 'Please try again!', 'danger')
            }
        }
    };

    return (
        <Fragment>
            <form className="request-completion-container" onSubmit={e => onSubmit(e)}>
                <h1>Complete the request</h1>
                <div className='request-completion-warning'><span>Warning: Requester cannot complete their own request</span></div>
                <div>
                    <div>Please upload a proof of completion<span>*</span></div>
                    <input type="file" name="photo" accept="image/jpeg,image/jpg,image/png" onChange={e => onChange(e)} />
                </div>
                <div className='request-completion-warning'>Photo must be in .png, .jpg, or .jpeg format</div>
                <input className="request-completion-btn" type="submit" value="Submit" />
            </form>
        </Fragment>

    )
}

export default withRouter(RequestComplete);
