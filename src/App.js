import React, { useState, useEffect } from 'react';
import { Amplify, API } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {
  UserProfileCreateForm
} from './ui-components';
import * as queries from './graphql/queries';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App({ signOut, user }) {
  return (
    <>
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
      <div style={{ marginTop: "2rem" }}>
        <UserProfile />
      </div>
    </>
  );
}

export default withAuthenticator(App);

const UserProfile = (props) => {
  const [showcreate, setshowcreate] = useState(false);
  const [profiles, setprofile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const listUserProfiles = await API.graphql({ query: queries.listUserProfiles });
      setprofile(listUserProfiles?.data?.listUserProfiles?.items)
    }
    // call the function
    fetchData().catch(console.error);
  }, []);

  return (
    <React.Fragment>
      <h3>Profile List:</h3>
      {Object.keys(profiles).sort((a, b) => parseInt(b) - parseInt(a)).map((key, index) => {
        let p = profiles[key];
        return (
          <p>{p.firstName}</p>
        )
      })}
      <div>
        {!showcreate ?
          <button onClick={() => setshowcreate(true)}>Create Profile</button>
          : <button onClick={() => setshowcreate(false)}>Back</button>}
        {showcreate && <UserProfileCreateForm />}
      </div>
    </React.Fragment>
  )
}