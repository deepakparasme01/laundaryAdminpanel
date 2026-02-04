import { useEffect, useMemo, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import { ProductTable } from "../../components/common/Table/ProductTable";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { addproduct, categoryList, deleteProduct, deleteService, editproduct, getProducts, getServices, productStatusUpdate, serviceStatusUpdate } from "../../apis/SuperAdmin";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IMG_BASE_URL } from "../../config/Config";
import DeleteModel from "../../components/common/DeleteModel/DeleteModel";
import { ProductModel } from "../../components/common/product-model/ProductModel";
import { MdDelete, MdEdit } from "react-icons/md";

export const Services = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add");
    const [selectedProduct, setSelectedProduct] = useState(null);


    const columns = useMemo(
        () => [

            { header: "Name", accessorKey: "name" },
            // {
            //     header: "Thumbnail",
            //     accessorKey: "image",
            //     cell: (info) => (
            //         <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            //             <img src={`${IMG_BASE_URL}${info.getValue()}`} alt="avatar" width={40} style={{ borderRadius: "50%" }} className="w-full h-full object-cover" />
            //         </div>
            //     ),
            // },
            // { header: "Type", accessorKey: "type" },
            { header: "Extra Charge", accessorKey: "extra_charge" },
            { header: "Description", accessorKey: "description" },

            {
                header: "Status", accessorKey: "status",
                size: 50,
                cell: (info) => {
                    const status = info.row.original.status;

                    const statusColor =
                        status === 1
                            ? "bg-green-100 text-green-600"
                            : status === 0
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600";

                    return (
                        <div
                            className={`flex gap-1 justify-center items-center rounded-full px-2 py-1 cursor-pointer font-semibold text-[12px] capitalize ${statusColor}`}
                            onClick={() => handleStatusToggle(info.row.original.id, status == 1 ? 0 : 1)}
                        >
                            {status == 1
                                ? "Active"
                                : status == 0
                                    ? "Deactive"
                                    : "Deleted"}
                        </div>
                    );
                },
            },
            {
                header: "Action",
                size: 100,
                cell: ({ row }) => {
                    return (
                        <div className="flex gap-2 justify-start">
                            <button
                                className="flex items-center gap-1 justify-center w-8 h-8 rounded-lg bg-[#3d9bc7] text-white cursor-pointer hover:bg-[#02598e] whitespace-nowrap"
                                onClick={() => {
                                    const id = row.original.id
                                    // openEditModal(row.original)
                                    navigate(`/update_service/${id}`);
                                }
                                }
                            >
                                <MdEdit size={16} />
                            </button>
                            <button
                                className="flex items-center gap-1 justify-center w-8 h-8 rounded-lg bg-red-500 text-white cursor-pointer hover:bg-red-600 whitespace-nowrap"
                                onClick={() =>
                                    handleDelete(row.original.id)
                                }
                            >
                                <MdDelete size={16} />
                            </button>
                        </div>
                    );
                },
            },
            // { header: "Age", accessorKey: "age" },
            // { header: "Country", accessorKey: "country" },
        ],
        []
    );


    // const openAddModal = () => {
    //     setMode("add");
    //     setSelectedProduct(null);
    //     setModalOpen(true);
    // };
    // const openEditModal = (product_data) => {
    //     setMode("edit");
    //     setSelectedProduct(product_data);
    //     setModalOpen(true);
    // };
    const fetchService = async () => {
        try {
            setIsLoading(true);
            const response = await getServices();
            if (response?.status == 200) {
                setServiceList(response?.data?.service || []);
                setIsLoading(false);
            }
            else if (response?.response?.data?.status == 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching service list:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchService();
    }, []);

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };
    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    }
    const confirmDelete = () => {
        const deleteservice = async () => {
            try {
                setIsLoading(true);
                const response = await deleteService(deleteId);
                if (response?.status == 200) {
                    toast.success(response?.message);
                    await fetchService();
                    closeDeleteModal();
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error deleting category:", error);
            } finally {
                setIsLoading(false);
            }
        };
        deleteservice();
    }



    const handleStatusToggle = async (id, newStatus) => {
        try {
            const response = await serviceStatusUpdate({ status: newStatus }, id);
            if (response?.status == 200) {
                toast.success(response?.message);
                await fetchService();
            }

        } catch (error) {
            console.error("Error updating service status:", error);
        }
    }

    // const handleSubmit = async (mode, formdata) => {
    //     try {
    //         setIsLoading(true);
    //         const submitData = new FormData();
    //         submitData.append("name", formdata?.name);
    //         submitData.append("cat_id", formdata?.category);
    //         submitData.append("subcat_id", formdata?.subcategory);
    //         submitData.append("price", formdata?.price);
    //         submitData.append("type", formdata?.type);
    //         submitData.append("description", formdata?.description);
    //         if (formdata.image) {
    //             submitData.append("image", formdata?.image);
    //         }
    //         let response;
    //         if (mode === "add") {
    //             response = await addproduct(submitData);
    //         } else {
    //             const id = selectedProduct.id;
    //             response = await editproduct(submitData, id);
    //         }
    //         console.log("response-model", response);

    //         if (response?.status == 200) {
    //             toast.success(response?.message);
    //             // setFormdata({
    //             //     categoryname: "",
    //             //     image: null
    //             // });
    //             setModalOpen(false);
    //             await fetchProducts();
    //             // navigate("/category_list");
    //         }
    //         else if (response?.response?.data?.status == 401) {
    //             toast.error(response?.response?.data?.message);
    //             localStorage.removeItem("user_role");
    //             localStorage.removeItem("laundary-token");
    //             navigate("/");
    //         }

    //     } catch (error) {
    //         console.error("Error submitting category:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }
    return (
        <>
            <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
                <BreadcrumbsNav customTrail={[{ label: "Services", path: "/products" }]} />
                <div className="flex justify-between items-center">

                    <PageTitle title={"All Services"} />
                    <button
                        className="bg-[#3d9bc7] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#02598e] text-[12px]"
                        // onClick={openAddModal}
                        onClick={() => navigate("/add_service")}
                    >
                        <span className="font-bold">+ </span>ADD NEW SERVICE
                    </button>
                </div>
                {/* Top KPI Cards */}
                {/* <UserTable /> */}
                <div className="mt-4">
                    <ProductTable columns={columns} productList={serviceList} isLoading={isLoading} />

                </div>
            </div>
            <DeleteModel
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                redbutton="Confirm"
                para="Do you really want to delete? This action cannot be
            undone."
                isLoading={isLoading}
            />
            {/* <ProductModel
                isOpen={isModalOpen}
                product_data={selectedProduct}
                mode={mode}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                isLoading={isLoading} /> */}
        </>
    );
}