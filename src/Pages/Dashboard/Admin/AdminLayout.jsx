import { NavLink, Outlet } from "react-router-dom";
import Header from "../../../Components/Header";
import { FaChevronRight } from "react-icons/fa6";
import Title from "../../../Components/Title";

const AdminLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-start p-4">
        <section className="bg-white rounded-md text-slate-800 text-[17px] 2xl:text-[20px] font-[500] shadow-md w-full max-w-[960px] relative mt-[140px] sm:mt-[100px] overflow-hidden">
          <div className="drawer">
            <input
              id="admin_navigation_drawer"
              type="checkbox"
              className="drawer-toggle"
            />
            <div className="drawer-content flex flex-col items-start justify-start p-5">
              {/* Page content here */}
              <label
                htmlFor="admin_navigation_drawer"
                className="cursor-pointer bg-indigo-200 text-indigo-700 text-[15px] rounded-md p-2 border-2 border-indigo-700 mb-3"
              >
                <FaChevronRight />
              </label>
              <Outlet />
            </div>
            <div className="drawer-side z-[99999]">
              <label
                htmlFor="admin_navigation_drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu p-4 w-80 min-h-full bg-indigo-50 text-[20px] 2xl:text-[24px] text-indigo-700 font-[500]">
                {/* Sidebar content here */}
                <Title>ADMIN</Title>
                <NavLink
                  to="/admin/registrations"
                  className={({ isActive }) =>
                    `block w-full py-3 border-b-[2px] border-b-indigo-100 hover:text-rose-600 ${
                      isActive ? "text-rose-600" : "text-indigo-700"
                    }`
                  }
                >
                  Registrations
                </NavLink>
                <NavLink
                  to="/admin/courses"
                  className={({ isActive }) =>
                    `block w-full py-3 border-b-[2px] border-b-indigo-100 hover:text-rose-600 ${
                      isActive ? "text-rose-600" : "text-indigo-700"
                    }`
                  }
                >
                  Courses
                </NavLink>
                <NavLink
                  to="/admin/add-course"
                  className={({ isActive }) =>
                    `block w-full py-3 border-b-[2px] border-b-indigo-100 hover:text-rose-600 ${
                      isActive ? "text-rose-600" : "text-indigo-700"
                    }`
                  }
                >
                  Add Course
                </NavLink>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AdminLayout;
