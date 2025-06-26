import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";
import logo from "../assets/logo.png";

const user = { _id: "", role: "user" };

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = () => {
    
  }

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
                {user.role === "admin" && (
                  <Link to={"/admin/dashboard"} onClick={() => setIsOpen(false)}>Admin</Link>
                )}

                <Link to={"/orders"} onClick={() => setIsOpen(false)}>Orders</Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <div className="authButtons">
            <Link className="logInButton" to={"/login"} onClick={() => setIsOpen(false)}>
               Login
            </Link>
            <Link className="signInButton" to={"/signIn"} onClick={() => setIsOpen(false)}>
              SignIn
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
