import PropTypes from "prop-types";
import { useState } from "react";

import { updateClient } from "../../services/client";
import { Notification, useToaster } from "rsuite";



ChangeDataForm.propTypes = {
  id: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
};

const telefonoRegexp = new RegExp(/^\d{9}$/);
const emailRegexp = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/);

export default function ChangeDataForm({ id, phone, email }) {
  const [telefono, setTelefono] = useState({
    value: phone,
    error: false,
    touched: false,
  });

  const toaster = useToaster();

  const [emailAddress, setEmailAddress] = useState({
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
            className="block mb-2 font-semibold leading-none text-white"
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
            placeholder="999888777"
            className={`w-full bg-[#0a0a0a] border px-3 py-2 border-brand-violet rounded-lg focus:ring-2 focus:ring-brand-violet/50 focus:outline-none text-white placeholder-zinc-500 ${
              telefono.error && telefono.touched ? "border-red-500" : ""
            }`}
          />
          {telefono.error && telefono.touched && (
            // eslint-disable-next-line react/no-unescaped-entities
            <p className="text-red-500">❌ Formato: 9 dígitos.</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 font-semibold leading-none text-white"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            defaultValue={email}
            value={emailAddress.value}
            name="email"
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="example@gmail.com"
            className={`w-full bg-[#0a0a0a] border px-3 py-2 border-brand-violet rounded-lg focus:ring-2 focus:ring-brand-violet/50 focus:outline-none text-white placeholder-zinc-500 ${
              emailAddress.error && emailAddress.touched ? "border-red-500" : ""
            }`}
          />
          {emailAddress.error && emailAddress.touched && (
            <p className="text-red-500">❌ Formato: example@gmail.com</p>
          )}
        </div>
        <div>
          <button
            type="button"
            disabled={telefono.error || emailAddress.error}
            onClick={async () => {
              if (telefono.error || emailAddress.error) {
                toaster.push(
                  <Notification type="error" header="Por favor, corrige los errores en el formulario" />,
                  { placement: "topEnd" }
                );
                return;
              }

              try {
                const response = await updateClient({ 
                  id, 
                  telefono: telefono.value, 
                  email: emailAddress.value 
                });

                if (response) {
                  toaster.push(
                    <Notification type="success" header="Datos actualizados correctamente" />,
                    { placement: "topEnd" }
                  );
                  // Opcionalmente, dar un pequeño retraso antes de recargar para que vean el mensaje
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              } catch (error) {
                toaster.push(
                  <Notification type="error" header="Error al actualizar los datos" />,
                  { placement: "topEnd" }
                );
              }
            }}
            className={`text-white hover:text-brand-violet border border-white/20 hover:border-brand-violet focus:ring-2 focus:outline-none focus:ring-brand-violet/50 font-medium rounded-lg text-sm px-6 py-2 text-center transition-all duration-300 bg-white/5 hover:bg-brand-violet/10 ${(telefono.error || emailAddress.error) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        ...emailAddress,
        value: e.target.value,
      });
    };

    const handleEmailBlur = () => {
      setEmailAddress({
        ...emailAddress,
        error: !emailRegexp.test(emailAddress.value),
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
