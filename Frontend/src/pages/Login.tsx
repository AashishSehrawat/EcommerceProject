import { FaGoogle } from "react-icons/fa6";

const Login = () => {
  return (
    <div className="login container">
      <div>
        <h1>Login</h1>
        <div className="inputLogin">
          <div>
            <label>Gender</label>
            <select name="gender" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="date" required />
          </div>
        </div>

        <div className="googleLogin">
          <p>Already Signed in once</p>
          <button>
            <FaGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
