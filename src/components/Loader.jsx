import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HashLoader color="#36d7b7" size={60} />
    </div>
  );
};

export default Loader;
