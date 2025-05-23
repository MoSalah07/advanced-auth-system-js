import { motion } from "framer-motion";
import React, { useState } from "react";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

interface IDataVal {
  fullName: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [dataVal, setDataVal] = useState<IDataVal>({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { register, error, isLoading } = useAuthStore();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(dataVal.email, dataVal.password, dataVal.fullName);
      navigate(`/verify-email`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>
        <form onSubmit={handleRegister}>
          <Input
            Icon={User}
            value={dataVal.fullName}
            onChange={(e) =>
              setDataVal({ ...dataVal, fullName: e.target.value })
            }
            name="fullName"
            type="text"
            placeholder="Full Name"
          />
          <Input
            Icon={Mail}
            value={dataVal.email}
            onChange={(e) => setDataVal({ ...dataVal, email: e.target.value })}
            type="email"
            name="email"
            placeholder="Email Address"
          />
          <Input
            Icon={Lock}
            value={dataVal.password}
            onChange={(e) =>
              setDataVal({ ...dataVal, password: e.target.value })
            }
            type="password"
            name="password"
            placeholder="Password"
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <PasswordStrengthMeter password={dataVal.password} />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Register"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{` `}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
