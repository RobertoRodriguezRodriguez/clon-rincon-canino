// // const url = "http://localhost:3002/api";
// const url = "https://booking-pets-back.vercel.app/";

export const updatePassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/admin`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error("401");
    }

    let responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.log(error);
  }
};