import { createPortal } from "react-dom";
import "./SideDrawer.css";

function SideDrawer(props) {
  const content = <aside className="side-drawer">{props.children}</aside>;
  return createPortal(content, document.getElementById("drawer-hook"));
}

export default SideDrawer;
