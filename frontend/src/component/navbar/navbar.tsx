import React from "react";
import sutlogo from "../../assets/sutlogo.png";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full">
      <div className="w-full fixed top-0 left-0 flex justify-between items-center bg-[#F26522] h-10 z-50">
        <div className="flex items-center pl-0 w-full">
          <img src={sutlogo} alt="Cpe" className="h-8 ml-4" />
        </div>
        <div className="flex space-x-10 mr-10 items-center">
          <Link to={`/home`}>
            <span className="text-white font-normal whitespace-nowrap">หน้าหลัก</span>
          </Link>
          <Link to={`/courseall`}>
            <span className="text-white font-normal whitespace-nowrap">ข้อมูลรายวิชา</span>
          </Link>
          <Link to={`/dashboardcourseall`}>
            <span className="text-white font-normal whitespace-nowrap">แดชบอร์ด</span>
          </Link>
          <Link to={`/login`}>
            <span className="text-white font-normal whitespace-nowrap">ออกจากระบบ</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
