import { useEffect, useState } from "react";
// My imports.
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import UsersList from "../components/UsersList";

async function fetchUsers(setIsLoading, setLoadedUsers, setError) {
  setIsLoading(true);
  try {
    // Default fetch is GET
    const response = await fetch("http://localhost:5050/api/users");

    const responseData = await response.json();

    if (!response.ok) {
      // If response data is not ok.
      throw new Error(responseData.message);
    }

    setLoadedUsers(responseData.users);
  } catch (err) {
    setError(err.message);
  }
  setIsLoading(false);
}
/**
 * Displays a list of current signed up users.
 * @returns JSX Element.
 */
function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    // Only when page loads useEffect(() => {}, []).
    fetchUsers(setIsLoading, setLoadedUsers, setError);
  }, []);

  const errorHandler = () => {
    setError(null);
  };
  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
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
