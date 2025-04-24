import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/authSlice";
function Register() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const validators = {
    firstName: (value) =>
      !value
        ? "First Name is required"
        : /^[A-Za-z]{3,}$/.test(value)
        ? ""
        : "At least 3 letters required",
    lastName: (value) =>
      !value
        ? "Last Name is required"
        : /^[A-Za-z]{3,}$/.test(value)
        ? ""
        : "At least 3 letters required",
    email: (value) =>
      !value
        ? "Email is required"
        : /\S+@\S+\.\S+/.test(value)
        ? ""
        : "Invalid email format",
    username: (value) =>
      !value
        ? "Username is required"
        : value.length >= 3
        ? ""
        : "At least 3 characters required",
    password: (value) =>
      !value
        ? "Password is required"
        : value.length >= 6
        ? ""
        : "At least 6 characters required",
    confirmPassword: (value) =>
      !value
        ? "Confirm Password is required"
        : value === formData.password
        ? ""
        : "Passwords do not match",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let newErrors = Object.keys(formData).reduce((acc, key) => {
      const error = validators[key](formData[key]);
      return error ? { ...acc, [key]: error } : acc;
    }, {});

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const result = await dispatch(register(formData));

    if (result.error) {
      return; // Optionally, you can set a general error state here
    }

    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 to-purple-600 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-purple-700 dark:text-yellow-300 mb-6">
          🎉 Sign Up
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {[
            { name: "firstName", label: "First Name" },
            { name: "lastName", label: "Last Name" },
            { name: "email", label: "Email" },
            { name: "username", label: "Username" },
            { name: "password", label: "Password" },
            { name: "confirmPassword", label: "Confirm Password" },
          ].map(({ name, label }) => (
            <div key={name} className="flex items-start gap-4">
              <label
                htmlFor={name}
                className="w-40 pt-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {label}
              </label>

              <div className="relative w-full">
                <input
                  type={
                    name.includes("password") && !showPassword[name]
                      ? "password"
                      : "text"
                  }
                  name={name}
                  id={name}
                  placeholder={`Enter ${label}`}
                  className="w-full p-2 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-100 to-green-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:from-gray-700 dark:to-gray-600 dark:text-white dark:placeholder-gray-400"
                  value={formData[name]}
                  onChange={handleChange}
                />

                {name.includes("password") && (
                  <span
                    className="absolute right-3 top-2.5 cursor-pointer text-gray-600 dark:text-gray-300"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [name]: !prev[name],
                      }))
                    }
                  >
                    {showPassword[name] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                )}

                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full p-2 mt-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold hover:opacity-90 transition dark:from-yellow-500 dark:to-yellow-400 dark:text-black"
          >
            Register 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
