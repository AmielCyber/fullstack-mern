import UsersList from "../components/UsersList";
function Users() {
  const USERS = [
    {
      id: "u1",
      name: "Lame",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Latte_and_dark_coffee.jpg/500px-Latte_and_dark_coffee.jpg",
      places: 3,
    },
  ];
  return <UsersList item={USERS} />;
}

export default Users;
