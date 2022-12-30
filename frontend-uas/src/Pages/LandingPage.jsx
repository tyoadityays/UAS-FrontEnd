import React, { useEffect, useState } from "react";

import {
  getSiswa,
  putSiswaDetail,
  deleteSiswa,
  postSiswa,
} from "../Action/Siswa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Pagination from "../Components/Pagination";
import Modal from "../Components/Modal";
import { toast } from "react-toastify";
import TableSkeleton from "../Components/TableSkeleton";
import { logout } from "../Action/Auth";

export default function LandingPage() {
  const [pageQuery, setPageQuery] = useSearchParams();
  const { register, handleSubmit, resetField } = useForm();
  const QueryClient = useQueryClient();
  const location = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [pageCounter, setPageCounter] = useState(1);

  const { mutate, status } = useMutation(logout);

  const users = localStorage.getItem("user");
  const user = JSON.parse(users);
  const role = user?.role;

  const [modalData, setModalData] = useState({
    id: "",
    nama: "",
    alamat: "",
    kota: "",
    provinsi: "",
    email: "",
  });

  const { mutate: mutateEdit } = useMutation(putSiswaDetail);
  const { mutate: mutateAdd } = useMutation(postSiswa);
  const { mutate: mutateDelete } = useMutation(deleteSiswa);

  const { isLoading, data } = useQuery(["siswa", search, pageCounter], () =>
    getSiswa(pageCounter, search)
  );

  useEffect(() => {
    if (status === "success") {
      toast.success("Logout Success");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      resetField();

      location("/login");
    }
  }, [status]);

  useEffect(() => {
    if (!showModal) {
      setModalData({
        id: "",
        nama: "",
        alamat: "",
        kota: "",
        provinsi: "",
        email: "",
      });
    }
  }, [showModal]);

  useEffect(() => {
    setPageQuery({ page: pageCounter });
  }, [pageCounter, setPageQuery]);

  const onSubmit = (data) => {
    setPageCounter(1);
    setSearch(data.search);
  };

  const handleOnChangeForm = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const onChangeData = (isSuccess, message) => {
    if (isSuccess) {
      QueryClient.invalidateQueries(["siswa", search, pageCounter]);
      toast.success(message);
    } else {
      toast.error(message);
    }

    setShowModal(false);
  };

  return (
    <>
      <Modal
        show={showModal}
        data={modalData}
        onClose={() => setShowModal(false)}
        onChangeForm={(v) => handleOnChangeForm(v)}
        onSubmitForm={() => {
          if (modalData.id) {
            mutateEdit(modalData, {
              onSuccess: (res) => {
                onChangeData(true, res?.message);
              },
              onError: (res) => {
                onChangeData(false, res?.message);
              },
            });
          } else {
            mutateAdd(modalData, {
              onSuccess: (res) => {
                onChangeData(true, res?.message);
              },
              onError: (res) => {
                onChangeData(false, res?.message);
              },
            });
          }
        }}
      />

      <NavBar />

      <div className="container mt-12 mx-auto px-5 md:px-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          
        </form>
        <div className="w-full flex justify-end mt-5 mb-5">
        <form
              onSubmit={handleSubmit(mutate)}
            >
        <button
              className="text-white w-36 bg-red-700 mr-10 h-10 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Logout
            </button>
        </form>
        {role === "admin" && (
            <button
              type="button"
              className="text-white w-36 bg-blue-700 h-10 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-blue-800"
              onClick={() => setShowModal(true)}
            >
              Add Siswa
            </button>
        )}
        </div>

        <div className="mt-5 mb-5 relative sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-blue-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Nama
                </th>
                <th scope="col" className="px-5 py-3">
                  Alamat
                </th>
                <th scope="col" className="px-5 py-3">
                  Kota
                </th>
                <th scope="col" className="px-5 py-3">
                  Provinsi
                </th>
                <th scope="col" className="px-5 py-3">
                  Email
                </th>

                {role === "admin" && (
                  <th scope="col" className="px-5 py-3">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton count={15} />}

              {!isLoading &&
                data?.data?.map((item, index) => {
                  return (
                    <tr
                      className="bg-white dark:bg-purple-800 border-b"
                      key={index}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                              {item.nama}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap border-b">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {item.alamat}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap border-b">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {item.kota}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap border-b">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {item.provinsi}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap border-b">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {item.email}
                        </div>
                      </td>
                      {role === "admin" && (
                        <td className="px-5 py-4 whitespace-nowrap flex justify-between text-sm font-medium border-b">
                          <button
                            type="button"
                            className="text-white w-16 mr-5 bg-amber-700 h-8 hover:bg-amber-800 text-center flex items-center justify-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-blue-800"
                            onClick={() => {
                              setShowModal(true);
                              setModalData(item);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-white w-16 bg-red-700 h-8 hover:bg-red-800 focus:ring-4 focus:outline-none flex items-center justify-center focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-red-800"
                            onClick={() => {
                              mutateDelete(item.id, {
                                onSuccess: (res) => {
                                  onChangeData(true, res.message);
                                },
                                onError: (res) => {
                                  onChangeData(true, res.message);
                                },
                              });
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={pageCounter}
        prevPage={() => {
          setPageCounter((prev) => prev - 1);
        }}
        nextPage={() => {
          setPageCounter((next) => next + 1);
        }}
        hasMoreData={!(data?.data?.current_page === data?.data?.last_page)}
      />
    </>
  );
}