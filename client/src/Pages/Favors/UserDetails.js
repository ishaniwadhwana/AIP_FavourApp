import React, { Fragment, useEffect, useState } from "react";
import '../../handler/ButtonHandler';
import { addNotification } from '../../handler/AlertHandler';
import '../../../node_modules/react-notifications-component/dist/theme.css'
import "./FavorDetails.css";

const UserDetails = () => {


const [users, setUsers] = useState([]);
 


 useEffect(() => {
    async function getCharacters() {
        try {

            const rawUser = await fetch(`/api/favors/users`);
            const users = await rawUser.json();
            setUsers(users.map(({ username, userid }) => ({ label: username, value: userid })));
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
        {users.map(({ label, value }) => (
            <option key={value} value={value}>
                {label}
            </option>
        ))}

</Fragment>

  );
};

export default UserDetails;