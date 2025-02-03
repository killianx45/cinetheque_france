import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  async function loginUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      alert("Veuillez vérifier vos identifiants");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-['Montserrat']">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h1 className="mb-8 text-3xl font-bold text-center font-['Montserrat']">
          Login
        </h1>
        <form onSubmit={loginUser} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-2 text-gray-700 font-['Montserrat']"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Montserrat']"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-2 text-gray-700 font-['Montserrat']"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Montserrat']"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 font-['Montserrat']"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 font-['Montserrat']">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="text-blue-500">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
