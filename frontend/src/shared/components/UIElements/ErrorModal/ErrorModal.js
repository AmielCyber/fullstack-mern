import Modal from "../Modal/Modal";
import Button from "../../FormElements/Button";

/**
 * Error Modal to display errors.
 * @param {*} props
 * @returns JSX Element.
 */
function ErrorModal(props) {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
}

export default ErrorModal;
