// get the access token and take the youtube username 
// add a button to invoke the contract function with youtube username as the parameter
// if the user already exists get the users info


// Props : isNewUser, token
// Can check the previous transactions made to the creator or total transaction amount

const Profile = ({ isNewUser, token }) => {
    return (
        <div>
            <h1>Profile</h1>
            <p>Is New User: {isNewUser ? "Yes" : "No"}</p>
            <p>Token: {token}</p>
        </div>
    );
}

export default Profile;