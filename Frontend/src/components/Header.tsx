import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useState } from "react";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/api/authApi";
import { logout } from "../redux/reducer/authReducer"; // Adjust the import path as necessary

 // Adjust the type as per your state structure

const Header = () => {
  const { user } = useSelector((state: any) => state.auth);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [logoutMutation] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await logoutMutation().unwrap();
      if(res?.success) {
        localStorage.removeItem("user");
        localStorage.removeItem("token")

        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
      } else {
        toast.error(res.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="header">
      {/* Logo */}
      <div>
        <Link to="/" className="logoDesign" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="" width="40px" />
          <span>BuyNest</span>
        </Link>
      </div>

      {/* Header items */}
      <div className="itemsHeader">
        <Link to={"/"} onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to={"/search"} onClick={() => setIsOpen(false)}>
          {" "}
          <FaSearch />{" "}
        </Link>
        <Link to={"/cart"} onClick={() => setIsOpen(false)}>
          {" "}
          <FaShoppingBag />{" "}
        </Link>

        {user?._id ? (
          <>
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog open={isOpen}>
              <div>
                {user?.role === "admin" && (
                  <Link
                    to={"/admin/dashboard"}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                <Link to={"/orders"} onClick={() => setIsOpen(false)}>
                  Orders
                </Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <div className="authButtons">
            <Link
              className="logInButton"
              to={"/login"}
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              className="signInButton"
              to={"/signUp"}
              onClick={() => setIsOpen(false)}
            >
              SignUp
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
