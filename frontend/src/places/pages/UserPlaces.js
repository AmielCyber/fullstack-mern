import { useParams } from "react-router-dom";
// My imports.
import PlaceList from "../components/PlaceList";

// Dummy places to be later replaced with google maps.
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Golden Gate Bridge",
    description: "San Francisco Golden Gate",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1200px-GoldenGateBridge-001.jpg",
    address: "Golden Gate Bridge, San Francisco, CA",
    location: {
      lat: 37.8199286,
      lng: -122.4782551,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Golden Gate Bridge",
    description: "San Francisco Golden Gate",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1200px-GoldenGateBridge-001.jpg",
    address: "Golden Gate Bridge, San Francisco, CA",
    location: {
      lat: 37.8199286,
      lng: -122.4782551,
    },
    creator: "u2",
  },
];
/**
 * Displays places from a user.
 * @returns UserPlaces component
 */
function UserPlaces() {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
}
export default UserPlaces;
