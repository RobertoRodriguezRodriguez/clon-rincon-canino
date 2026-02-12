import PropTypes from "prop-types";
import { useState } from "react";

import ChangeDataForm from "./change-data-form";

UserInfo.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  dni: PropTypes.string,
};

export default function UserInfo({ id, name, phone, email, dni }) {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  return (
    <section>
      <div className="pt-24 px-4 mx-auto max-w-screen-lg">
        <div className="flex space-x-10 w-screen">
          <h2 className="mb-2 text-xl font-semibold leading-none text-gray-900 md:text-2xl">
            {name}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleShowForm}
              className="text-zinc-600 inline-flex items-center hover:border hover:border-zinc-400 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-1 text-center"
            >
              <svg
                aria-hidden="true"
                className="mr-1 -ml-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Edit
            </button>
          </div>
        </div>
        <h3 className="mb-4 text-lg font-extrabold leading-none text-gray-900 md:text-lg">
          {phone}
        </h3>
        <dl className="flex items-center space-x-10">
          <div>
            <dt className="mb-2 font-semibold leading-none text-gray-900">
              DNI
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5">{dni}</dd>
          </div>
          <div>
            <dt className="mb-2 font-semibold leading-none text-gray-900">
              Correo electrónico
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5">{email}</dd>
          </div>
        </dl>
      </div>
      {showForm && <ChangeDataForm id={id} phone={phone} email={email} />}
    </section>
  );
}
