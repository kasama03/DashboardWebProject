import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/component/navbar/navbar";

const CourseAll: React.FC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: `url(https://elearning2.sut.ac.th/pluginfile.php/1/theme_suranaree/mainbgimg/1733990438/E_learing%20art_Day%2016_9_min.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        margin: 0,
        padding: 0,
      }}
    >
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="text-left mt-0">
            <span className="font-normal">
              1. กลุ่มวิชาชีพบังคับทางวิศวกรรมศาสตร์
            </span>
          </div>
          <Link to={`/coursetype?type=วิชาพื้นฐานทางวิศวกรรมศาสตร์`}>
            <Button className="button-secondary w-72">กลุ่มวิชาพื้นฐานทางวิศวกรรมศาสตร์</Button>
          </Link>

          <div className="text-center">
            <span className="font-normal">
              2. กลุ่มวิชาชีพบังคับทางวิศวกรรมศาสตร์
            </span>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link to={`/coursetype?type=ด้านเทคโนโลยีเพื่องานประยุกต์`}>
              <Button className="button-secondary w-72">ด้านเทคโนโลยีเพื่องานประยุกต์</Button>
            </Link>
            <Link to={`/coursetype?type=ด้านเทคโนโลยีและวิธีการทางซอฟต์แวร์`}>
              <Button className="button-secondary w-72">ด้านเทคโนโลยีและวิธีการทางซอฟต์แวร์</Button>
            </Link>
            <Link to={`/coursetype?type=ด้านโครงสร้างพื้นฐานของระบบ`}>
              <Button className="button-secondary w-72">ด้านโครงสร้างพื้นฐานของระบบ</Button>
            </Link>
            <Link to={`/coursetype?type=ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์`}>
              <Button className="button-secondary w-72">ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์</Button>
            </Link>
          </div>

          <div className="text-center">
            <span className="font-normal">
              3. กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์
            </span>
          </div>
          <Link to={`/coursetype?type=กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์`}>
            <Button className="button-secondary w-72">กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseAll;
