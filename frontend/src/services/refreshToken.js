import axios from "axios";

const BASE_URL = "http://localhost:3000/api/auth";

export async function refreshToken() {
  // Obtener el refreshToken del localStorage
  const refreshTokenUser = localStorage.getItem("refreshToken");

  try {
    const response = await axios.post(`${BASE_URL}/refreshtokens`, {
      refreshToken: refreshTokenUser, // Asegúrate de que el cuerpo de la petición coincida con lo que tu API espera
    });

    // Guardar los tokens actualizados en localStorage
    localStorage.setItem("accessToken", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  } catch (error) {
    // Es importante manejar la posibilidad de que el refreshToken no sea válido o haya expirado
    if (error.response && error.response.status === 401) {
      // Aquí podrías manejar un logout o una redirección a la página de login
    }
    return await Promise.reject(error.response.data);
  }
}
