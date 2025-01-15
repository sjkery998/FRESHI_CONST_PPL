import { checkUser } from "./webAuth.jsx";

const toAuthWebPage = (navigate) => {
  navigate("/AuthWebPage");
};

export { toAuthWebPage, checkUser };