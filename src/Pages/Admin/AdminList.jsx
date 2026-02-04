import { useNavigate } from "react-router-dom";
import { adminList } from "../../apis/SuperAdmin";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import { DataTable } from "../../components/common/Table/DataTable";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useEffect, useState } from "react";
import DeleteModel from "../../components/common/DeleteModel/DeleteModel";
export const AdminList = () => {
  const navigate = useNavigate();

  const [adminListData, setAdminListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await adminList();
      if (response?.status == 200) {
        setAdminListData(response?.data?.admin || []);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching admin list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
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
  // const confirmDelete = () => {

  //   const deleteCategory = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await deletecategory(deleteId);
  //       console.log("delete response:", response);

  //       if (response?.status == 200) {
  //         // Refresh the category list after deletion
  //         // const updatedCategories = adminListData.filter(
  //         //   (category) => category.id !== deleteId
  //         // );
  //         // setAdminListData(updatedCategories);
  //         toast.success(response?.message);
  //         await fetchCategories();
  //         closeDeleteModal();

  //         setIsLoading(false);
  //       }
  //       console.log("Delete Category Response:", response);
  //     } catch (error) {
  //       console.error("Error deleting category:", error);
  //     } finally {
  //       setIsLoading(false);

  //     }
  //   };
  //   deleteCategory();
  // }
  return (
    <>
      <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
        <BreadcrumbsNav customTrail={[{ label: "Admin List", path: "/admin_list" }]} />
        <div className="flex justify-between items-center">
          <PageTitle title={"Admin List"} />
          <button
            className="bg-[#3d9bc7] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#02598e] text-[12px]"
            onClick={() => navigate("/add_admin")}
          >
            <span className="font-bold">+ </span>ADD ADMIN
          </button>
        </div>
        {/* Top KPI Cards */}
        {/* <UserTable /> */}
        <div className="mt-4">
          <DataTable adminListData={adminListData} isLoading={isLoading} handleEdit={handleEdit} handleDelete={handleDelete} />
        </div>
      </div>
      <DeleteModel
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        // onConfirm={confirmDelete}
        redbutton="Confirm"
        para="Do you really want to delete? This action cannot be
            undone."
      />
    </>
  );
}; 