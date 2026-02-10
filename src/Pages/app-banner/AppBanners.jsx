import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE_URL } from "../../config/Config";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import DeleteModel from "../../components/common/DeleteModel/DeleteModel";
import { bannerStatusUpdate, deletebanner, getBanners } from "../../apis/SuperAdmin";
import { BannerTable } from "../../components/common/Table/BannerTable";
import { MdDelete, MdEdit } from "react-icons/md";

export const AppBanners = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [bannerList, setBannerList] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = useMemo(
        () => [

            {
                header: "S.N",
                cell: (info) => <span>{info.row.index + 1}</span>,
                size: 50,
            },
            { header: "Title", accessorKey: "title" },
            {
                header: "Image",
                accessorKey: "image",
                cell: (info) => (
                    <div className=" overflow-hidden">
                        <img src={`${IMG_BASE_URL}${info.getValue()}`} alt="avatar" width={100} className=" object-cover" />
                    </div>
                ),
            },

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
                                onClick={() => {
                                    const id = row.original.id
                                    // openEditModal(row.original)
                                    navigate(`/update_banner/${id}`);
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

    const fetchBanners = async () => {
        try {
            setIsLoading(true);
            const response = await getBanners();
            if (response?.status == 200) {
                setBannerList(response?.data?.slider_list || []);
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
        fetchBanners();
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
        const deleteBanner = async () => {
            try {
                setIsLoading(true);
                const response = await deletebanner(deleteId);
                if (response?.status == 200) {
                    toast.success(response?.message);
                    await fetchBanners();
                    closeDeleteModal();
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error deleting category:", error);
            } finally {
                setIsLoading(false);
            }
        };
        deleteBanner();
    }



    const handleStatusToggle = async (id, newStatus) => {
        try {
            const response = await bannerStatusUpdate({ status: newStatus }, id);
            if (response?.status == 200) {
                toast.success(response?.message);
                await fetchBanners();
            }

        } catch (error) {
            console.error("Error updating category status:", error);
        }
    }
    return (
        <>
            <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
                <BreadcrumbsNav customTrail={[{ label: "Banners", path: "/banners" }]} />
                <div className="flex justify-between items-center">

                    <PageTitle title={"App Banners"} />
                    <button
                        className="bg-[#3d9bc7] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#02598e] text-[12px]"
                        // onClick={openAddModal}
                        onClick={() => navigate("/add_banner")}
                    >
                        <span className="font-bold">+ </span>ADD NEW BANNER
                    </button>
                </div>
                {/* Top KPI Cards */}
                {/* <UserTable /> */}
                <div className="mt-4">
                    <BannerTable columns={columns} bannerList={bannerList} isLoading={isLoading} />

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
            {/* <CategoryModel
        isOpen={isModalOpen}
        cat_data={selectedCategory}
        mode={mode}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading} /> */}
        </>
    );
}