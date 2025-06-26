import { useState } from "react";
import { useQuery, useMutation, gql, useLazyQuery } from "@apollo/client";
import "./App.css";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      age
      name
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});

  // Queries
  // useQuery automatically fetches when the component mounts (or when variables change)
  // Apollo client will handle everything automatically (caching, refetching, and loading/error states)
  // We dont need to use the useEffect like in a normal React app
  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);

  // We dont need to direct fetch this user data on mount
  // Instead we need to get the data on the dropdown change
  // useLazyQuery is the correct approch for dynamic fetch
  // const {
  //   data: getUserByIdData,
  //   loading: getUserByIdLoading
  // } = useQuery(GET_USER_BY_ID, { variables: { id: "2" } });

  const [getUserById, { data: getUserByIdData, loading: getUserByIdLoading }] =
    useLazyQuery(GET_USER_BY_ID);

  // Select User
  const handleSelectUser = (e) => {
    const { value } = e.target;
    value && getUserById({ variables: { id: value } });
  }

  // Mutation
  // ============
  // Create User
  const [createUser] = useMutation(CREATE_USER);
  // const [createUser] = useMutation(CREATE_USER, {
  //   refetchQueries: [{ query: GET_USERS }] // Refetch users after mutation
  // })

  const handleCreateUser = async () => {
    createUser({
      variables: {
        name: newUser.name,
        age: Number(newUser.age),
        isMarried: false, //Setting a default value
      },
    });

    setNewUser({});
  };

  // Delete User
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }] // Refetch users after mutation
  });
  const handleDeleteUser = async (userId) => {
    deleteUser({
      variables: {
        id: userId,
      },
    });
  }

  return (
    <>
      {/* Add a new user */}
      <div>
        <h2> Add User </h2>
        <form onSubmit={handleCreateUser}>
          <input
            placeholder="Name..."
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            placeholder="Age..."
            type="number"
            min={18}
            max={100}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, age: e.target.value }))
            }
          />
          <button type="submit" disabled={!newUser?.name || !newUser?.age}> Create User</button>
        </form>
      </div>

      {/* Display the selected User */}
      <div>
        <h2> Chosen User </h2>
        <select onChange={handleSelectUser} style={{ cursor: "pointer" }}>
          {getUsersLoading ? (
            <option>Loading....</option>
          ) : (
            <>
              <option value="">Select a user</option>
              {getUsersData?.users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
            </>
          )}

        </select>
        {getUserByIdLoading ? (
          <p> Loading user...</p>
        ) : (
          <div className="user-card">
            <p>{getUserByIdData?.user?.name}</p>
            <p>{getUserByIdData?.user?.age}</p>
          </div>
        )}
      </div>

      {/* Display all the Users */}
      <div>
        <h2> All Users</h2>
        {getUsersLoading ? <p> Loading users...</p> :
          getUsersError ? <p>Error: {getUsersError.message}</p> : (
            <div>
              {getUsersData?.users.map((user) => (
                <div key={user.id} className="user-card-container">
                  <div className="user-card">
                    <p> <b>Name:</b> {user.name}</p>
                    <p> <b>Age:</b> {user.age}</p>
                    <p> <b>Is this user married:</b> {user.isMarried ? "Yes" : "No"}</p>
                  </div>
                  <div className="close-btn" onClick={() => handleDeleteUser(user.id)}>X</div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </>
  );
}

export default App;