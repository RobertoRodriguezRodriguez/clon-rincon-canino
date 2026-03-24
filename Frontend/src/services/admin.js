const url = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:3001/api" : "https://clon-rincon-canino-back.onrender.com/api");

export const updatePassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${url}/admin`, {
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