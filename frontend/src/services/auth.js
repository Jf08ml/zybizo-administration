import { apiAuth } from "./api.js";
import { useAuthStore } from "../stores/auth.js";
import { showLoading, hideLoading } from "../stores/loadingStore.js";

const useAuth = useAuthStore();

export async function login(loginInfo) {
  try {
    showLoading();
    const { email, password } = loginInfo;
    const response = await apiAuth.post(`/login`, { email, password });
  
    localStorage.setItem("accessToken", response.data.data.accessToken.token);
    localStorage.setItem(
      "refreshToken",
      response.data.data.accessToken.refreshToken
    );

    useAuth.setCredentials(
      response.data.data.accessToken.token,
      response.data.data.accessToken.refreshToken,
      response.data.data.user.role.name
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function signup(registerInfo) {
  const { email, password } = registerInfo;
  try {
    const response = await apiAuth.post(
      `/signup`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    localStorage.setItem("accessToken", response.data.data.accessToken.token);
    localStorage.setItem(
      "refreshToken",
      response.data.data.accessToken.refreshToken
    );
    useAuth.setCredentials(
      response.data.data.accessToken.token,
      response.data.data.accessToken.refreshToken,
      response.data.data.createUser.role.name
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  } finally {
    hideLoading();
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
    useAuth.userRole = response.data.rol.name;
    return response.data.rol;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}
