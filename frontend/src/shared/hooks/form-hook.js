import { useCallback, useReducer } from "react";

/**
 * Form reducer to manage form state changes.
 * @param state  The current react state.
 * @param action The action to be performed on the state.
 * @returns The new state.
 */
function formReducer(state, action) {
  switch (action.type) {
    case "INPUT_CHANGE": {
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    }
    case "SET_DATA": {
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    }
    default:
      return state;
  }
}

/**
 * Form custom hook state.
 * @param initialInputs
 * @param initialFormValidity
 * @returns form hook. [formState, inputHandler, setFormData];
 */
export function useForm(initialInputs, initialFormValidity) {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
}
