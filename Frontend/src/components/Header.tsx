import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";
import logo from "../assets/logo.png";

const user = { _id: "1", role: "admin" };

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
                  <Link to={"/admin/dashboard"}>Admin</Link>
                )}

                <Link to={"/orders"}>Orders</Link>
                <button>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <Link to={"/login"}>
            {" "}
            <FaSignInAlt />{" "}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
