import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../redux/api/authApi";


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const [signup] = useSignupMutation();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);  
      formData.append("gender", gender);
      formData.append("dob", dob);
      if (photo) {
        formData.append("photo", photo, photo.name); 
      } else {
        toast.error("Please upload a profile photo.");
        return;
      }
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      const res = await signup(formData).unwrap();

      if (res?.success) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(res.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  }

  return (
    <div className="signUpPage">
      <div className="signUpContainer">
        <h1>Enter your details</h1>
        <div className="signUpForm">
          <form onSubmit={submitHandler} method="POST">
            <div className="inputGroup">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="photo">Profile Photo</label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                required
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPhoto(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="gender">Gender</label>
              <select
                name="gender"
                id=""
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="inputGroup">
              <label htmlFor="dob">Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
