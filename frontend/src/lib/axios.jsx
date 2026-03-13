import axois from "axois";

const axoisInstance = axios.create({
  baseUrl: <import className="meta env"></import>,
  withCredentials: true, // browser send the cookies to server automatically on every req
});

export default axoisInstance;
