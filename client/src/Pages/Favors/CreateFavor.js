import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { Form, Button, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import { withRouter, useHistory } from 'react-router-dom';
import './CreateFavor.css';
import '../../handler/ButtonHandler';
import { addNotification } from '../../handler/AlertHandler';
import '../../../node_modules/react-notifications-component/dist/theme.css'
import UserDetails from './UserDetails';
import ItemDetails from './ItemDetails';

//To-do list
//Fix default button (maybe hide all ptions at start?)
//Catch errors

const CreateFavor = () => {
    const [formData, setFormData] = useState({
        task: '',
        borrower: '',
        lender: '',
        quantity: '',
    });

    let history = useHistory();
    let { task, borrower, lender, quantity } = formData;
    const [state, setState] = useState({
        file: null
    });
    const { file } = state;
    //Checks that there's a file uploaded 
    const onUpload = e => {
        // console.log(e.target.files.length)
        if (e.target.files.length !== 0) {
            !e.target.files[0].name.match(/.(jpg|jpeg|png)$/i) || e.target.files[0].size >= 1000000 ?
                addNotification('File failed', 'Only .png, .jpg and .jpeg format with less than 1mb allowed!', 'danger') :
                setState({ file: e.target.files[0] });
        }
    }
    //Get data when form changes
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };
    const [type, setType] = useState('');
    function onLenderChange() {
        setType('lender')
    }
    function onBorrowerChange() {
        setType('borrower')
    }

    const onSubmit = async e => {
        e.preventDefault();
        let newFavor = {
            task, borrower, lender, quantity
        }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify(newFavor);
        //check the user type
        if (type === 'lender') {
            let check = { task, borrower, quantity }
            let errors = Object.values(check).some(o => o === '' || o === 'SELECT OPTION');
            if (errors !== true) {
                try {
                    if (file !== null) {
                        const newPost = await axios.post(`/api/favors/lender`, body, config);
                        const newPostId = newPost.data.data.user.favorid;

                        const photoFormData = new FormData();
                        photoFormData.append('photo', file);
                        // console.log("form data from react: ", file)
                        const photoConfig = {
                            headers: {
                                'content-type': 'multipart/form-data'
                            }
                        };

                        await axios.post(`/api/file/favor/${newPostId}`, photoFormData, photoConfig)
                        //await axios.post(`/api/party/trigger`)
                        await axios.post(`/api/favors/${newPostId}/items`, body, config);
                        addNotification('Submission completed', 'Favor is successfully added!', 'success');
                        history.goBack();

                    } else {
                        addNotification('Submission failed', 'Please upload a valid photo', 'danger')
                    }

                } catch (err) {
                    console.error(err.message);
                    addNotification('Submission failed', 'Please try again', 'danger')
                }
            } else {
                addNotification('Submission failed', 'Please try again. Make sure you complete all the fields', 'danger')
            }
        } else if (type === 'borrower') {
            let check = { task, lender, quantity }
            let errors = Object.values(check).some(o => o === '' || o === 'SELECT OPTION');
            if (errors !== true) {
                try {
                    const newPost = await axios.post(`/api/favors/borrower`, body, config);
                    const newPostId = newPost.data.data.user.favorid
                    await axios.post(`/api/favors/${newPostId}/items`, body, config);
                    //await axios.post(`/api/party/trigger`)
                    addNotification('Submission completed', 'Favor added', 'success');
                    history.goBack();
                } catch (err) {
                    console.error(err.message);
                    addNotification('Submission failed', 'Please try again', 'danger')
                }
            } else {
                addNotification('Submission failed', 'Please try again. Make sure you complete all the fields', 'danger')
            }
        } else {
            addNotification('Submission failed', 'Please try again. Make sure you selected Lender or Borrower', 'danger')
        }

    }
    return (
        <Fragment>
            <div className="request-container">
                <h1>Add a Favor</h1>
                <div>
                    <Form onSubmit={e => onSubmit(e)}>
                        <div>
                            <br></br>
                            <h3>Are you the borrower or the lender ?</h3>
                            <br></br>
                            <Form.Group>
                             <ToggleButtonGroup type="radio" name="distribution" className="mb-1" style={{paddingRight: 20}}>
                                    <ToggleButton name="lender" onChange={e => onChange(e)} onClick={onLenderChange}>
                                        LENDER</ToggleButton>
                                        </ToggleButtonGroup>
                                        <ToggleButtonGroup type="radio" name="distribution" className="mb-1" style={{paddingRight: 20}}>
                                    <ToggleButton name="borrower" onChange={e => onChange(e)} onClick={onBorrowerChange}>
                                        BORROWER
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Form.Group>
                        </div>
                        <Form.Group>
                            {type === 'borrower' ? (
                                <div>
                                    <Form.Group controlId="lender" >
                                        <Form.Label>Select the Lender<span>*</span></Form.Label>
                                        <Form.Control as="select" name="lender" value={lender} onChange={e => onChange(e)}>
                                            <UserDetails />
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                //Else user is a lender
                            ) : type === 'lender' ? (
                                <div>
                                    <Form.Group controlId="borrower" >
                                        <Form.Label>Select the Borrower<span>*</span></Form.Label>
                                        <Form.Control as="select" name="borrower" value={borrower} onChange={e => onChange(e)}>
                                            <UserDetails />
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="photo" >
                                        <Form.Label>Please upload a photo<span>*</span></Form.Label>
                                        <Form.Control type="file" name="photo" accept="image/jpeg,image/jpg,image/png" onChange={e => onUpload(e)}>
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                            ) : null
                            }
                        </Form.Group>
                        {type !== '' ? (
                            <div>
                                <Form.Group controlId="task" >
                                    <Form.Label>Select the favor item<span>*</span></Form.Label>
                                    <Form.Control as="select" name="task" value={task} onChange={e => onChange(e)}>
                                        <ItemDetails />
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="quantity" >
                                    <Form.Label>How many items?<span>*</span></Form.Label>
                                    <div className='reward-warning'>Quantity must be a number that is greater than 0 and smaller than 21<span>*</span></div>
                                    <Form.Control type="number" name="quantity" value={quantity} onChange={e => onChange(e)}>
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" type="submit">Submit</Button>
                            </div>
                        ) : <div>Please select either Lender or Borrower<span>*</span></div>}

                    </Form>
                </div>
            </div>
        </Fragment>
    )

}
export default withRouter(CreateFavor)
