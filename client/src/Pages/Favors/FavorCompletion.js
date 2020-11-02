import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { addNotification } from "../../handler/AlertHandler";

import "./FavorCompletion.css";

const FavorCompletion = (props) => {
  const { id } = useParams();
  const [type, setType] = useState("");
  const [state, setState] = useState({
    file: null
  });

  const { file } = state;


  useEffect(() => {
    async function fetchUserType() {
      try {
        const response = await axios.get(`/api/profile/user`);
        props.user.borrowerid === response.data.data.user.userid ? setType('borrower') : setType('lender');
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserType();
  }, [props.user.borrowerid]);

  let history = useHistory();
  const onChange = e => {
    setState({ file: e.target.files[0] });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'borrower') {
        const formData = new FormData();
        formData.append('photo', file);
        console.log("form data from react: ", file)
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        };
        await axios.post(`/api/file/favor/${id}`, formData, config);
        await axios.post(`/api/favors/borrower/complete/${id}`)
      } else {
        await axios.post(`/api/favors/lender/complete/${id}`)
      }

      addNotification(
        "Submission complete",
        "The favor has been completed! We have updated the favor",
        "success"
      );
      //redirect user to the profile page
      history.push(`/profile`);
    } catch (err) {
      console.error(err);
      addNotification("Submission failed", "Please try again!", "danger");
    }
  };

  return (
    <form className="favor-completion" onSubmit={(e) => onSubmit(e)}>
      <h1>Complete the Favor</h1>
      {type === 'borrower' ? (
        <div>
          <div>Please upload a proof of completion<span>*</span></div>
          <input type="file" name="photo" accept="image/jpeg,image/jpg,image/png" onChange={e => onChange(e)} />
          <div className="favor-completion-requirement">Photo must be in .png, .jpg, or .jpeg format</div>
        </div>
      ) :
        <div>
          <div>Are you sure to complete the favor?</div>
          <div>If so, please click the Submit button to complete the favor<span>*</span></div>
        </div>
      }
      <input className="favor-completion-btn" type="submit" value="Submit" />
    </form>
  );
};
export default FavorCompletion;
