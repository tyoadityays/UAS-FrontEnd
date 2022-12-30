import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { login } from "../Action/Auth";

export default function Login() {
  const { register, handleSubmit, resetField } = useForm();

  const location = useNavigate();

  const { mutate, status, data } = useMutation(login);

  useEffect(() => {
    if (status === "success") {
      if (data?.data?.success) {
        toast.success("Login Success");

        localStorage.setItem("token", data?.data?.token);
        localStorage.setItem("user", JSON.stringify(data?.data?.user));

        resetField();

        location("/");
      } else {
        toast.error(data?.response?.data?.message);
      }
    }
  }, [status]);

  return (
    <section className="bg-gray-50 light:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-black"
        >
          UAS FRONTEND PROJECT
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white" align="center">
              LOGIN
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(mutate)}
            >
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Masukkan Email Anda
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="email@gmail.com"
                  required=""
                  {...register("email")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  {...register("password")}
                />
              </div>

              <button className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-primary">
                Login
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Belum Punya Akun?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Register Disini
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}