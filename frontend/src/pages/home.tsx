import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Navbar from "@/component/navbar/navbar";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const form = useForm();

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
        <Form {...form}>
          <div className="flex flex-col items-center space-y-6 w-full mt-10">
            <Link to={`/courseall`}>
              <Button className="button-secondary w-72">ข้อมูลรายวิชา</Button>
            </Link>
            <Link to={`/dashboardcourseall`}>
              <Button className="button-secondary w-72">แดชบอร์ด</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Home;
