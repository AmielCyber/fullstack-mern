import "./LoadingSpinner.css";

/**
 * Displays a loading spinner. Used when we are fetching data or waiting a response
 * from our backend.
 * @param {asOverlay} props: {asOverlay: boolean}
 * @returns JSX Element.
 */
function LoadingSpinner(props) {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export default LoadingSpinner;
