import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// My imports.
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";

async function fetchPlaces(sendRequest, setLoadedPlaces, userId) {
  try {
    const responseData = await sendRequest(
      `http://localhost:5050/api/places/user/${userId}`
    );
    if (responseData) {
      setLoadedPlaces(responseData.places);
    }
  } catch (err) {
    console.error(err);
  }
}
/**
 * Displays places from a user.
 * @returns UserPlaces component
 */
function UserPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    fetchPlaces(sendRequest, setLoadedPlaces, userId);
  }, [userId, sendRequest]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={placeDeletedHandler} />
      )}
    </>
  );
}
export default UserPlaces;
