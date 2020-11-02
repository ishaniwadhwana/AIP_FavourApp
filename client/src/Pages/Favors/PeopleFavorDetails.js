import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Moment from "react-moment";
import { addNotification } from "../../handler/AlertHandler";
import Button from "../../handler/ButtonHandler";
import FavorCompletion from "./FavorCompletion";

import Modal from "react-modal";

import "./FavorDetails.css";
Modal.setAppElement("#root");

const PeopleFavorDetails = () => {
  const { id } = useParams();
  const [loadFavor, setFavor] = useState("");
  const [displayCompletionForm, toggleCompletionForm] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  let history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/favors/people/${id}`);
        setFavor(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [id]);
  const deleteFavor = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete favor?");
      if (confirm === true) {
        await axios.delete(`/api/favors/${id}`);
        addNotification(
          "Favor deleted",
          "The favor has been deleted!",
          "success"
        );
        // Redirect to the profile page
        history.push(`/profile`);
      }
    } catch (err) {
      console.error(err.message);
      addNotification("Favor deleted", "The favor cannot be deleted", "danger");
    }
  };

  const noProof = () => {
    addNotification("No Proof", "There is no proof available", "danger");
  };

  return (
    <div className="favor-container">
      {}
      <Button to="/profile">Back to Profile</Button>
      <div className="favor-delete">
        <Button onClick={() => deleteFavor()}>Delete Favor</Button>
      </div>
      <div className="favor-item">
        <h1>Favor: #{loadFavor.favorid}</h1>
        <div>Borrower: {loadFavor.username}</div>
        <div>
          Date Created:
          <Moment format="YYYY/MM/DD">{loadFavor.datecreated}</Moment>
        </div>
        <hr />
        <h3>
          Favor: {loadFavor.quantity} x {loadFavor.itemname}
        </h3>
      </div>
      <div className="favor-complete">
        <Button onClick={() => toggleCompletionForm(!displayCompletionForm)}>
          Complete Favor
        </Button>
      </div>
      {loadFavor.photo !== null ? (
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
                <img src={loadFavor.photo} alt="favor-proof" />
              </div>
              <div className="close-btn">
                <Button onClick={() => setModalIsOpen(false)}>Close</Button>
              </div>
            </div>
          </Modal>
        </div>
      ) : (
        <div className="favor-view">
          <Button onClick={() => noProof()}>View Proof</Button>
        </div>
      )}

      <div>{displayCompletionForm && <FavorCompletion user={loadFavor} />}</div>
    </div>
  );
};

export default PeopleFavorDetails;
