import { useContext } from "react";
import { NavLink } from "react-router-dom";
// My imports.
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

function NavLinks() {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink end to="/">
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn ? (
        <>
          <li>
            <NavLink to="/u1/places">MY PLACES</NavLink>
          </li>
          <li>
            <NavLink to="/places/new">ADD PLACE</NavLink>
          </li>
        </>
      ) : (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
}

export default NavLinks;
