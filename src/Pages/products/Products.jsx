import { useEffect, useMemo, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import { ProductTable } from "../../components/common/Table/ProductTable";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { addproduct, categoryList, deleteProduct, editproduct, getProducts, productStatusUpdate } from "../../apis/SuperAdmin";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IMG_BASE_URL } from "../../config/Config";
import DeleteModel from "../../components/common/DeleteModel/DeleteModel";
import { ProductModel } from "../../components/common/product-model/ProductModel";

export const Products = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add");
    const [selectedProduct, setSelectedProduct] = useState(null);


    const columns = useMemo(
        () => [
            {
                header: "S.N",
                cell: (info) => <span>{info.row.index + 1}</span>,
                size: 50,
            },
            { header: "Name", accessorKey: "name" },
            {
                header: "Thumbnail",
                accessorKey: "image",
                cell: (info) => (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img src={`${IMG_BASE_URL}${info.getValue()}`} alt="avatar" width={40} style={{ borderRadius: "50%" }} className="w-full h-full object-cover" />
                    </div>
                ),
            },
            { header: "Type", accessorKey: "type" },
            { header: "Price", accessorKey: "price" },
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
                            onClick={() => handleStatusToggle(info.row.original.id, status === 1 ? 0 : 1)}
                        >
                            {status === 1
                                ? "Active"
                                : status === 0
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
                                onClick={() =>
                                    openEditModal(row.original)
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


    const openAddModal = () => {
        setMode("add");
        setSelectedProduct(null);
        setModalOpen(true);
    };
    const openEditModal = (product_data) => {
        setMode("edit");
        setSelectedProduct(product_data);
        setModalOpen(true);
    };
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await getProducts();
            if (response?.status == 200) {
                setProductList(response?.data?.product_list || []);
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
            console.error("Error fetching admin list:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
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
        const deleteproduct = async () => {
            try {
                setIsLoading(true);
                const response = await deleteProduct(deleteId);
                if (response?.status == 200) {
                    toast.success(response?.message);
                    await fetchProducts();
                    closeDeleteModal();
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error deleting category:", error);
            } finally {
                setIsLoading(false);
            }
        };
        deleteproduct();
    }



    const handleStatusToggle = async (id, newStatus) => {
        try {
            const response = await productStatusUpdate({ status: newStatus }, id);
            if (response?.status == 200) {
                toast.success(response?.message);
                await fetchProducts();
            }

        } catch (error) {
            console.error("Error updating category status:", error);
        }
    }

    const handleSubmit = async (mode, formdata) => {
        try {
            setIsLoading(true);
            const submitData = new FormData();
            submitData.append("name", formdata?.name);
            submitData.append("cat_id", formdata?.category);
            submitData.append("subcat_id", formdata?.subcategory);
            submitData.append("price", formdata?.price);
            submitData.append("type", formdata?.type);
            submitData.append("description", formdata?.description);
            if (formdata.image) {
                submitData.append("image", formdata?.image);
            }
            let response;
            if (mode === "add") {
                response = await addproduct(submitData);
            } else {
                const id = selectedProduct.id;
                response = await editproduct(submitData, id);
            }
            console.log("response-model", response);

            if (response?.status == 200) {
                toast.success(response?.message);
                // setFormdata({
                //     categoryname: "",
                //     image: null
                // });
                setModalOpen(false);
                await fetchProducts();
                // navigate("/category_list");
            }
            else if (response?.response?.data?.status == 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }

        } catch (error) {
            console.error("Error submitting category:", error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
                <BreadcrumbsNav customTrail={[{ label: "Product List", path: "/products" }]} />
                <div className="flex justify-between items-center">

                    <PageTitle title={"All Products"} />
                    <button
                        className="bg-[#3d9bc7] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#02598e] text-[12px]"
                        onClick={openAddModal}
                    // onClick={() => navigate("/add_category")}
                    >
                        <span className="font-bold">+ </span>ADD NEW PRODUCT
                    </button>
                </div>
                {/* Top KPI Cards */}
                {/* <UserTable /> */}
                <div className="mt-4">
                    <ProductTable columns={columns} productList={productList} isLoading={isLoading} />

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
            <ProductModel
                isOpen={isModalOpen}
                product_data={selectedProduct}
                mode={mode}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                isLoading={isLoading} />
        </>
    );
}