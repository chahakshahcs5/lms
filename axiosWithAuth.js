const axiosWithAuth = (access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios;
};

export default axiosWithAuth;
