import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { login, logout } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
function Login() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validators = {
    email: (value) =>
      !value
        ? "Email is required"
        : /\S+@\S+\.\S+/.test(value)
        ? ""
        : "Invalid email format",
    password: (value) =>
      !value
        ? "Password is required"
        : value.length >= 6
        ? ""
        : "At least 6 characters required",
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = Object.fromEntries(
      Object.entries(formData)
        .map(([key, value]) => [key, validators[key](value)])
        .filter(([_, error]) => error)
    );

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // console.log(formData);
    const { email, password } = formData;
    const result = await dispatch(login({ email, password }));

    if (result.error) {
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    navigate("/");
  };
  // useEffect(() => {
  //   // Auto logout when user enters login page
  //   dispatch(logout());
  // }, [dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 shadow-2xl rounded-lg border-t-4 border-blue-500 dark:border-yellow-500">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-yellow-300 mb-4">
          Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {Object.keys(formData).map((field) => (
            <div key={field} className={field === "password" ? "relative" : ""}>
              <input
                type={
                  field === "password" && !showPassword ? "password" : "text"
                }
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border-2 border-transparent focus:border-blue-500 rounded-lg transition-all outline-none shadow-sm dark:bg-gray-700 dark:text-white"
              />
              {field === "password" && (
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-300"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              )}
              {errors[field] && (
                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all shadow-lg dark:from-yellow-500 dark:to-yellow-400 dark:text-black"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
