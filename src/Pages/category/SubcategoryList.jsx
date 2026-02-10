import { useNavigate } from "react-router-dom";
import { addSubcategory, deletesubcategory, subcategoryList, subcategoryStatusUpdate, updateSubcategory } from "../../apis/SuperAdmin";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import { CategoryTable } from "../../components/common/Table/CategoryTable";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DeleteModel from "../../components/common/DeleteModel/DeleteModel";
import { IMG_BASE_URL } from "../../config/Config";
import { MdDelete, MdEdit } from "react-icons/md";
import { SubcategoryModel } from "../../components/common/subcategory-model/SubcategoryModel";
export const SubcategoryList = () => {
  const navigate = useNavigate();
  const [adminListData, setAdminListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: "S.N",
        cell: (info) => <span>{info.row.index + 1}</span>,
        size: 50,
      },
      {
        header: "Image",
        accessorKey: "image",
        cell: (info) => (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img src={`${IMG_BASE_URL}${info.getValue()}`} alt="avatar" width={40} style={{ borderRadius: "50%" }} className="w-full h-full object-cover" />
          </div>
        ),
      },
      { header: "Name", accessorKey: "name" },
      { header: "Category", accessorKey: "category.name" },
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
    setSelectedSubcategory(null);
    setModalOpen(true);
  };
  const openEditModal = (cat_data) => {
    setMode("edit");
    setSelectedSubcategory(cat_data);
    setModalOpen(true);
  };

  const fetchSubcategories = async () => {
    try {
      setIsLoading(true);
      const response = await subcategoryList();
      if (response?.status == 200) {
        setAdminListData(response?.data?.sub_category_list || []);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching admin list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleEdit = (id) => {
    alert(`Edit category with ID: ${id}`);
    // navigate(`/edit_category/${id}`);
  }
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  }

  const confirmDelete = () => {
    const deleteCategory = async () => {
      try {
        setIsLoading(true);
        const response = await deletesubcategory(deleteId);
        if (response?.status == 200) {
          toast.success(response?.message);
          await fetchSubcategories();
          closeDeleteModal();
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setIsLoading(false);
      }
    };
    deleteCategory();
  }

  const handleStatusToggle = async (id, newStatus) => {
    try {
      const response = await subcategoryStatusUpdate({ status: newStatus }, id);
      if (response?.status == 200) {
        toast.success(response?.message);
        await fetchSubcategories();
      }

    } catch (error) {
      console.error("Error updating category status:", error);
    }
  }

  const handleSubmit = async (mode, formdata) => {
    try {
      setIsLoading(true);
      const submitData = new FormData();
      submitData.append("name", formdata?.subcategory);
      submitData.append("cat_id", formdata?.category);
      // submitData.append("subcat_id", formdata?.subcategory);
      // submitData.append("price", formdata?.price);
      // submitData.append("type", formdata?.type);
      // submitData.append("description", formdata?.description);
      if (formdata.image) {
        submitData.append("image", formdata?.image);
      }
      let response;
      if (mode === "add") {
        response = await addSubcategory(submitData);
      } else {
        const id = selectedSubcategory.id;
        response = await updateSubcategory(submitData, id);
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
        <BreadcrumbsNav customTrail={[{ label: "Subcategory List", path: "/subcategory_list" }]} />
        <div className="flex justify-between items-center">
          <PageTitle title={"Subcategory List"} />
          <button
            className="bg-[#3d9bc7] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#02598e] text-[12px]"
            onClick={openAddModal}
          // onClick={() => navigate("/add_subcategory")}
          >
            <span className="font-bold">+ </span>ADD SUBCATEGORY
          </button>
        </div>
        {/* Top KPI Cards */}
        {/* <UserTable /> */}
        <div className="mt-4">
          <CategoryTable columns={columns} adminListData={adminListData} isLoading={isLoading} handleEdit={handleEdit} handleDelete={handleDelete} handleStatusToggle={handleStatusToggle} />

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
      <SubcategoryModel
        isOpen={isModalOpen}
        subcat_data={selectedSubcategory}
        mode={mode}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading} />
    </>
  );
}; 