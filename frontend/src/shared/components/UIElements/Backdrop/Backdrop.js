import ReactDOM from "react-dom";
// My imports.
import "./Backdrop.css";

/**
 * Backdrop displays the background darker to emphasize a display on the website.
 * @param {onClick} props: {onClick: function} Call callback when this backdrop is clicked on.
 * @returns Backdrop Component.
 */
function Backdrop(props) {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById("backdrop-hook")
  );
}

export default Backdrop;
