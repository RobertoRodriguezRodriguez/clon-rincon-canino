import PropTypes from "prop-types";
import { useState } from "react";

import { updateClient } from "../../services/client";
import { Notification, useToaster } from "rsuite";



ChangeDataForm.propTypes = {
  id: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
};

const telefonoRegexp = new RegExp(/^\(\+\d{2}\)\d{9}$/);
const emailRegexp = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/);

export default function ChangeDataForm({ id, phone, email }) {
  const [telefono, setTelefono] = useState({
    value: phone,
    error: false,
    touched: false,
  });

  const toaster = useToaster();

  const [emailAddres, setEmailAddress] = useState({
    value: email,
    error: false,
    touched: false,
  });

  const {
    handleTelefonoChange,
    handleTelefonoBlur,
    handleEmailChange,
    handleEmailBlur,
  } = handleFunction();

  return (
    <form className="px-4 mx-auto max-w-screen-lg">
      <div className="flex flex-col space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 font-semibold leading-none text-gray-900"
          >
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={phone}
            value={telefono.value}
            onChange={handleTelefonoChange}
            onBlur={handleTelefonoBlur}
            className={`w-full border px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none ${
              telefono.error && telefono.touched ? "border-red-500" : ""
            }`}
          />
          {telefono.error && telefono.touched && (
            // eslint-disable-next-line react/no-unescaped-entities
            <p className="text-red-500">❌ Formato: '(+34)123456789'.</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 font-semibold leading-none text-gray-900"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            defaultValue={email}
            value={emailAddres.value}
            name="email"
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className={`w-full border px-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none ${
              emailAddres.error && emailAddres.touched ? "border-red-500" : ""
            }`}
          />
          {emailAddres.error && emailAddres.touched && (
            <p className="text-red-500">❌ Formato: example@gmail.com</p>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              const telefono = document.getElementById("phone").value;
              const email = document.getElementById("email").value;
              const response = updateClient({ id, telefono, email });
              if (response) {
                toaster.push(
                  <Notification type="success" header="Datos actualizados correctamente" />,
                  { placement: "topEnd" }
                );
                window.location.reload();
              }
              
            }}
            className="text-zinc-700 hover:text-green-700 border border-zinc-700 hover:border-green-700 focus:ring-2 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-sm px-4 py-0.5 text-center"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>
  );

  function handleFunction() {
    const handleTelefonoChange = (e) => {
      setTelefono({
        ...telefono,
        value: e.target.value,
      });
    };

    const handleTelefonoBlur = () => {
      setTelefono({
        ...telefono,
        error: !telefonoRegexp.test(telefono.value),
        touched: true,
      });
    };

    const handleEmailChange = (e) => {
      setEmailAddress({
        ...emailAddres,
        value: e.target.value,
      });
    };

    const handleEmailBlur = () => {
      setEmailAddress({
        ...emailAddres,
        error: !emailRegexp.test(emailAddres.value),
        touched: true,
      });
    };
    return {
      handleTelefonoChange,
      handleTelefonoBlur,
      handleEmailChange,
      handleEmailBlur,
    };
  }
}
