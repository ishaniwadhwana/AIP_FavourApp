import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Moment from "react-moment";
import Button from "../../handler/ButtonHandler";
import FavorCompletion from "./FavorCompletion";

import { addNotification } from "../../handler/AlertHandler";
import Modal from "react-modal";

import "./FavorDetails.css";
Modal.setAppElement("#root");

const UserFavorDetails = () => {
  const { id } = useParams();

  const [loadUserFavor, setUserFavor] = useState("");
  const [displayCompletionForm, toggleCompletionForm] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/favors/user/${id}`);
        setUserFavor(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [id]);

  const noProof = () => {
    addNotification("No Proof", "There is no proof available", "danger");
  };

  return (
    <div className="favor-container">
    
      <Button to="/profile">Back to Profile</Button>
      <div className="favor-item">
        <h1>Favor: #{loadUserFavor.favorid}</h1>
        <div>Lender: {loadUserFavor.username}</div>
        <div>
          Date Created:
          <Moment format="YYYY/MM/DD">{loadUserFavor.datecreated}</Moment>
        </div>
        <hr />
        <h3>
          Favor Item: {loadUserFavor.quantity} x {loadUserFavor.itemname}
        </h3>
      </div>
      <div className="favor-complete">
        <Button
          onClick={() => toggleCompletionForm(!displayCompletionForm)}
          type="button"
        >
          Repay
        </Button>
      </div>
      {loadUserFavor.photo !== null ? (
        <div className="favor-view">
          <Button onClick={() => setModalIsOpen(true)}>View Proof</Button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={{
              overlay: {
                backgroundColor: "grey",
              },
            }}
          >
            <div>
              <div className="image-container">
                <img src={loadUserFavor.photo} alt="favor-proof" />
              </div>
              <div className="close-btn">
                <Button onClick={() => setModalIsOpen(false)}>Close</Button>
              </div>
            </div>
          </Modal>
        </div>
      ) : (
        <div className="favor-view">
          {" "}
          <Button onClick={() => noProof()}>View Proof</Button>
        </div>
      )}

      <div>
        {displayCompletionForm && <FavorCompletion user={loadUserFavor} />}
      </div>
    </div>
  );
};

export default UserFavorDetails;
