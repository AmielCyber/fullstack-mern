import "./MainHeader.css";

/**
 * MainHeader component that contains all navigation links for our website.
 * @param {children} props The children of the navigation bar.
 * @returns MainHeader Component
 */
function MainHeader(props) {
  return <header className="main-header">{props.children}</header>;
}

export default MainHeader;
