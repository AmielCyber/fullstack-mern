import { useEffect, useState } from "react";
// My imports.
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import UsersList from "../components/UsersList";
import { useHttpClient } from "../../shared/hooks/http-hook";

async function fetchUsers(sendRequest, setLoadedUsers) {
  try {
    // Default fetch is GET
    const responseData = await sendRequest("http://localhost:5050/api/users");
    if (responseData) {
      setLoadedUsers(responseData.users);
    }
  } catch (err) {
    console.log(err);
  }
}
/**
 * Displays a list of current signed up users.
 * @returns JSX Element.
 */
function Users() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    // Only when page loads useEffect(() => {}, []).
    fetchUsers(sendRequest, setLoadedUsers);
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
}

export default Users;
