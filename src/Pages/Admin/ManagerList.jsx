import { useNavigate } from "react-router-dom";
import { managerList } from "../../apis/SuperAdmin";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import { DataTable } from "../../components/common/Table/DataTable";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useEffect, useState } from "react";
export const ManagerList = () => {
  const navigate = useNavigate();
  const [adminListData, setAdminListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setIsLoading(true);
        const response = await managerList();
        if (response?.status == 200) {
          setAdminListData(response?.data?.manager || []);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching admin list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagers();
  }, []);

  return (
    <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
      <BreadcrumbsNav customTrail={[{ label: "Manager List", path: "/manager_list" }]} />
      <div className="flex justify-between items-center">
        <PageTitle title={"Manager List"} />
        <button
          className="bg-[#3d9bc7] text-white cursor-pointer px-4 py-2 rounded hover:bg-[#02598e] text-[12px]"
          onClick={() => navigate("/add_manager")}
        >
          <span className="font-bold">+ </span>ADD MANAGER
        </button>
      </div>
      {/* Top KPI Cards */}
      {/* <UserTable /> */}
      <div className="mt-4">
        <DataTable adminListData={adminListData} isLoading={isLoading} />

      </div>
    </div>
  );
}; 