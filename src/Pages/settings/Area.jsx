import React, { useEffect, useMemo, useState } from 'react';
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav/BreadcrumbsNav';
import PageTitle from '../../components/PageTitle/PageTitle';
import { ProductTable } from '../../components/common/Table/ProductTable';
import DeleteModel from '../../components/common/DeleteModel/DeleteModel';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { getAreaList, addArea, editArea, deleteArea, areaStatusUpdate } from '../../apis/SuperAdmin';
import { useNavigate } from 'react-router-dom';

const AreaModal = ({ isOpen, onClose, areaData, mode, onSubmit, isLoading }) => {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && areaData) {
                setName(areaData.area_name);
            } else {
                setName("");
            }
            setErrors({});
        }
    }, [isOpen, mode, areaData]);

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = "Area name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit({ area_name: name });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex justify-center items-center z-[9999]">
            <div className="w-[90%] max-w-md bg-white rounded-lg p-6 relative">
                <div className="absolute top-2 right-2">
                    <button onClick={onClose}>
                        <IoMdClose className="text-gray-600 text-xl hover:text-red-500" />
                    </button>
                </div>
                <h1 className="text-lg font-semibold mb-4">{mode === "add" ? "Add" : "Update"} Area</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label className="">Area Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter area name"
                            className="border border-gray-200 p-3 text-sm focus:outline-none rounded"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : (mode === "add" ? "Save" : "Update")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Area = () => {
    const navigate = useNavigate();
    const [areaList, setAreaList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedArea, setSelectedArea] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchAreas = async () => {
        try {
            setIsLoading(true);
            const response = await getAreaList();
            if (response?.status === 200) {
                setAreaList(response?.data?.area_list || []);
            } else if (response?.response?.data?.status === 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }
        } catch (error) {
            console.error("Error fetching area list:", error);
            toast.error("Failed to fetch area list");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        try {
            const response = await areaStatusUpdate({ status: newStatus }, id);
            if (response?.status === 200) {
                toast.success(response?.message);
                fetchAreas();
            } else {
                toast.error(response?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setIsLoading(true);
            const response = await deleteArea(deleteId);
            if (response?.status === 200) {
                toast.success(response?.message);
                fetchAreas();
                setShowDeleteModal(false);
            } else {
                toast.error(response?.message || "Failed to delete area");
            }
        } catch (error) {
            console.error("Error deleting area:", error);
            toast.error("Error deleting area");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddClick = () => {
        setModalMode('add');
        setSelectedArea(null);
        setModalOpen(true);
    };

    const handleEditClick = (area) => {
        setModalMode('edit');
        setSelectedArea(area);
        setModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        try {
            setModalLoading(true);
            let response;
            if (modalMode === 'add') {
                response = await addArea(formData);
            } else {
                response = await editArea(formData, selectedArea.id);
            }

            if (response?.status === 200) {
                toast.success(response?.message);
                setModalOpen(false);
                fetchAreas();
            } else {
                toast.error(response?.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving area:", error);
            toast.error("Error saving area");
        } finally {
            setModalLoading(false);
        }
    };

    const columns = useMemo(() => [
        {
            header: "S.N",
            cell: (info) => <span>{info.row.index + 1}</span>,
            size: 50,
        },
        { header: "Area Name", accessorKey: "area_name" },
        {
            header: "Status", accessorKey: "status",
            size: 50,
            cell: (info) => {
                const status = info.row.original.status;
                const statusColor = status === 1 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
                return (
                    <div
                        className={`flex gap-1 justify-center items-center rounded-full px-2 py-1 cursor-pointer font-semibold text-[12px] capitalize ${statusColor}`}
                        onClick={() => handleStatusToggle(info.row.original.id, status)}
                    >
                        {status === 1 ? "Active" : "Inactive"}
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
                            onClick={() => handleEditClick(row.original)}
                        >
                            <MdEdit size={16} />
                        </button>
                        <button
                            className="flex items-center gap-1 justify-center w-8 h-8 rounded-lg bg-red-500 text-white cursor-pointer hover:bg-red-600 whitespace-nowrap"
                            onClick={() => handleDeleteClick(row.original.id)}
                        >
                            <MdDelete size={16} />
                        </button>
                    </div>
                );
            },
        },
    ], []);

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Settings", path: "#" }, { label: "Area", path: "/area" }]} />
            <div className="flex justify-between items-center">
                <PageTitle title={"Area List"} />
                <button
                    className="bg-[#3d9bc7] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#02598e] text-[12px]"
                    onClick={handleAddClick}
                >
                    <span className="font-bold">+ </span>ADD NEW AREA
                </button>
            </div>
            <div className="mt-4">
                <ProductTable columns={columns} productList={areaList} isLoading={isLoading} />
            </div>

            <DeleteModel
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                redbutton="Confirm"
                para="Do you really want to delete? This action cannot be undone."
                isLoading={isLoading}
            />

            <AreaModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                areaData={selectedArea}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={modalLoading}
            />
        </div>
    );
};

export default Area;
