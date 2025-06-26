import { FaGoogle } from "react-icons/fa6";

const Login = () => {

  const submitHandler = () => {
    // Handle login logic here
  };

  return (
    <div className="login container">
      <div>
        <h1>Login</h1>
        <form className="inputLogin">
          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="Email" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" required />
          </div>
          <div>
            <button className="button" onSubmit={submitHandler} type="submit">Login</button>
          </div>
        </form>

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
