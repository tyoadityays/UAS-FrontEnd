import fetcher from "../Utils/Fetcher";

const login = async (data) => {
  try {
    const response = await fetcher("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    return error;
  }
};

const register = async (data) => {
  try {
    const response = await fetcher("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    return error;
  }
};

const logout = async () => {
  try {
    const response = await fetcher("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export { login, register, logout };