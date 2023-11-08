import { apiAuth } from "./api.js";
import { useAuthStore } from "../stores/auth.js";
import { showLoading, hideLoading } from "../stores/loadingStore.js";

const useAuth = useAuthStore();

export async function login(loginInfo) {
  try {
    showLoading();
    const { identifier, password } = loginInfo;
    const response = await apiAuth.post(`/login`, { identifier, password });
    
    // Usar directamente de response.data para asegurarse que son los valores actualizados
    localStorage.setItem("accessToken", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    // Ahora actualizamos el estado de auth store con los nuevos valores
    useAuth.setCredentials(
      response.data.token,
      response.data.refreshToken,
      response.data.role
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function signup(email, password) {
  try {
    const response = await apiAuth.post(
      `/signup`,
      {
        nickname,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    useAuth.token = response.data.token;
    useAuth.refreshTokenUser = response.data.refreshToken;
    localStorage.setItem("accessToken", useAuth.token);
    localStorage.setItem("refreshToken", useAuth.refreshTokenUser);
    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}

export async function getUser() {
  try {
    showLoading();

    const token = useAuthStore().token;
    const response = await apiAuth.get(`/getuser`, {
      headers: {
        "Cache-Control": "no-cache",
        Authorization: token,
      },
    });
    useAuth.userImgProfile = response.data.user.userUrlPhoto;
    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function updateUser(userData) {
  try {
    showLoading();

    const token = useAuthStore().token;
    const response = await apiAuth.put(`/updateuser`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function updatePassword(passwords) {
  try {
    showLoading();

    const token = useAuthStore().token;
    const response = await apiAuth.put(`/updatepassword`, passwords, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function getUserRole() {
  try {
    const token = useAuthStore().token;
    const response = await apiAuth.get(`/userrole`, {
      headers: {
        "Cache-Control": "no-cache",
        Authorization: token,
      },
    });
    useAuth.userRolName = response.data.rol.name;
    return response.data.rol;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}
