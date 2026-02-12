import { useState } from "react";
import PropTypes from "prop-types";
import { updatePassword } from "../../services/admin";
import { Notification, useToaster } from "rsuite";



ChangePasswordForm.propTypes = {
  email: PropTypes.string.isRequired,
};

export default function ChangePasswordForm( { email }) {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: false,
    touched: false,
  });

  const toaster = useToaster();

  const {
    handleConfirmPasswordChange,
    handleConfirmPasswordBlur,
  } = handleFunction();
  return (
    <form className="m-auto max-w-screen-lg pt-4 px-4">
      <div className="flex flex-col space-y-3">
        <label
          htmlFor="password-confirm"
          className="font-semibold leading-none text-gray-900"
        >
          Nueva contraseña
        </label>
        <input
          type="password"
          id="password-confirm"
          name="password-confirm"
          value={confirmPassword.value}
          onChange={handleConfirmPasswordChange}
          onBlur={handleConfirmPasswordBlur}
          className={`w-full border px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-600 focus:outline-none focus:border-zinc-600 ${
            confirmPassword.error && confirmPassword.touched
              ? "border-red-500"
              : ""
          }`}
        />
      </div>
      <button
        type="submit"
        onClick={async (e) => {
          e.preventDefault();
          const newPassword = document.getElementById("password-confirm").value;
          const response = await updatePassword(email, newPassword);
          if (response.message) {
            toaster.push(
              <Notification type="info" header={response.message} />,
              { placement: "topEnd" }
            );
          }
          
        }}
        className="inline-flex mt-4 items-center text-zinc-600 hover:text-green-700 border border-zinc-600 hover:border-green-700 focus:ring-2 focus:outline-none focus:ring-zinc-400 font-medium rounded-lg text-sm px-5 py-0.5 text-center"
      >
        Guardar
      </button>
    </form>
  );

  function handleFunction() {

    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword({
        ...confirmPassword,
        value: e.target.value,
      });
    };

    const handleConfirmPasswordBlur = () => {
      setConfirmPassword({
        ...confirmPassword,
        touched: true,
      });
    };
    return {
      handleConfirmPasswordChange,
      handleConfirmPasswordBlur,
    };
  }
}
