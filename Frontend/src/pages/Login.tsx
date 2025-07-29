import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/api/authApi";
import { setCredentials } from "../redux/reducer/authReducer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e: React.FormEvent) => {
    // Handle login logic here
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();

      if (res?.success) {
        // Assuming you want to redirect after login
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.accessTokenCreated);

        dispatch(setCredentials({
          user: res.data.user,
          token: res.data.accessTokenCreated,
        }))

        toast.success("Login successful!");
        navigate("/"); // Redirect to home page or dashboard
      } else {
        toast.error(res.message || "Login failed. Please try again.");
      }

    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login container">
      <div>
        <h1>Login</h1>
        <form className="inputLogin" onSubmit={submitHandler} method="post">
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className="button" type="submit">
              Login
            </button>
          </div>
        </form>

        {/* <div className="googleLogin">
          <p>Already Signed in once</p>
          <button>
            <FaGoogle /> <span>Sign in with Google</span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
