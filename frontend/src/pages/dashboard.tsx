import React, { useState, useEffect } from "react";
import Navbar from "@/component/navbar/navbar";
import { GetCourseDashboard, GetCourseAll } from "@/services/https/httpRequest";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Pie from "@/component/dashboard/pie";
import Bar from "@/component/dashboard/bar";

// สร้าง interface สำหรับ Clo
interface Clo {
  CloNo: number;
  StudentAll: number;
  TotalPass: number;
  PloID: number;
  PiID: number;
  DescriptionClo: string;
}

const Dashboard: React.FC = () => {
  const { TermID, YearID } = useParams();

  const [ID, setID] = useState<string>("");
  const [courseID, setCourseID] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");

  const [courseinformationID, setCourseinformationID] = useState<string>("");
  const [students, setStudents] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [terms, setTerm] = useState<string>("");
  const [years, setYear] = useState<string>("");
  const [academicranks, setAcademicRanks] = useState<string>("");

  const [avg_gpa, setAvgGpa] = useState<string>("");
  const [avg_max, setAvgMax] = useState<string>("");
  const [avg_min, setAvgMin] = useState<string>("");
  const [avg_mean, setAvgMean] = useState<string>("");
  const [avg_sd, setAvgSd] = useState<string>("");

  const [grades, setGrades] = useState<Record<string, number>>({
    A: 0,
    Bplus: 0,
    B: 0,
    Cplus: 0,
    C: 0,
    Dplus: 0,
    D: 0,
    F: 0,
    M: 0,
    I: 0,
    S: 0,
    U: 0,
    P: 0,
    W: 0,
  });

  const [plo, setPlo] = useState<number[]>([]);
  const [pi, setPi] = useState<number[]>([]);
  const [clo, setClo] = useState<number[]>([]);
  const [description, setDescription] = useState<string[]>([]);
  const [studentall, setStudentAll] = useState<number[]>([]);
  const [totalpass, setTotalPass] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourseAll = async () => {
      const storedCourseTypeID = localStorage.getItem("CourseTypeID");
      if (!storedCourseTypeID) return;

      const CourseTypeID = parseInt(storedCourseTypeID, 10);
      if (isNaN(CourseTypeID)) return;

      try {
        const res = await GetCourseAll(CourseTypeID, TermID, YearID);

        if (res && res.length > 0) {
          const courseInfo = res[0];
          console.log("courseinfo", courseInfo);

          if (courseInfo) {
            const courseData = courseInfo.CourseInformation;
            setCourseinformationID(courseData.ID.toString() || "");
            setStudents(courseData.StudentEnrolled?.toString() || "");
            setFirstName(courseData.TeacherFirstname || "");
            setLastName(courseData.TeacherLastname || "");
            // setTerm(courseData.TermID?.toString() || "");
            // setYear(courseData.YearID?.toString() || "");
            // setAcademicRanks(courseData.AcademicRankID?.toString() || "");
            setAvgGpa(courseInfo.Score.AvgGpa || "");
            setAvgMax(courseInfo.Score.AvgMax || "");
            setAvgMin(courseInfo.Score.AvgMin || "");
            setAvgMean(courseInfo.Score.AvgMean || "");
            setAvgSd(courseInfo.Score.AvgSd || "");

            const gradeData = courseInfo.Grade || {};
            setGrades({
              A: Number(gradeData.A || 0),
              Bplus: Number(gradeData.Bplus || 0),
              B: Number(gradeData.B || 0),
              Cplus: Number(gradeData.Cplus || 0),
              C: Number(gradeData.C || 0),
              Dplus: Number(gradeData.Dplus || 0),
              D: Number(gradeData.D || 0),
              F: Number(gradeData.F || 0),
              M: Number(gradeData.M || 0),
              I: Number(gradeData.I || 0),
              S: Number(gradeData.S || 0),
              U: Number(gradeData.U || 0),
              P: Number(gradeData.P || 0),
              W: Number(gradeData.W || 0),
            });

            // ดึงข้อมูล CLO หลายชุด
          const cloData = courseInfo.Clo || [];
          const cloNumbers = cloData.map((clo: Clo) => Number(clo.CloNo));
const studentAllNumbers = cloData.map((clo: Clo) => Number(clo.StudentAll));
const totalPassNumbers = cloData.map((clo: Clo) => Number(clo.TotalPass));

setPlo(cloData.map((clo: Clo) => clo.PloID || []));
setPi(cloData.map((clo: Clo) => clo.PiID || []));
setClo(cloNumbers); // เก็บหลายค่า CLO
setDescription(cloData.map((clo: Clo) => clo.DescriptionClo || ""));
setStudentAll(studentAllNumbers); // เก็บหลายค่า StudentAll
setTotalPass(totalPassNumbers); // เก็บหลายค่า TotalPass

          } else {
            console.error("No course data found.");
          }
        } else {
          console.error("No course data found.");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseAll();
  }, [TermID, YearID]);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedCourseTypeID = localStorage.getItem("CourseTypeID");
      if (!storedCourseTypeID) return;

      const CourseTypeID = parseInt(storedCourseTypeID, 10);
      if (isNaN(CourseTypeID)) return;

      try {
        const res = await GetCourseDashboard(CourseTypeID, TermID, YearID);

        if (res && res.length > 0) {
          const data = res[0];
          console.log("dashboard", data);

          if (data) {
            const dashboardData = data;
            setTerm(dashboardData.Term || "");
            setYear(dashboardData.Year || "");
            setAcademicRanks(dashboardData.Ranks || "")
          } else {
            console.error("No course data found.");
          }
        } else {
          console.error("No course data found.");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    console.log("term", setTerm)
    fetchDashboardData();
  }, [TermID, YearID]);

  const gradeData = Object.entries(grades).map(([name, value]) => ({
    value,
    name,
  }));

  useEffect(() => {
    const storedId = localStorage.getItem("CourseTypeID");
    if (storedId) setID(storedId);

    const storedCourseID = localStorage.getItem("CourseID");
    if (storedCourseID) setCourseID(storedCourseID.replace(/"/g, ""));

    const storedCourseName = localStorage.getItem("CourseName");
    if (storedCourseName) setCourseName(storedCourseName.replace(/"/g, ""));
  }, []);

  return (
    <div className="w-full h-screen relative">
      <Navbar />
      <div>
        <div className="flex mt-5 w-full">
          <Card className="flex flex-col mt-5 w-96 h-40 justify-between">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>ข้อมูลทั่วไปของรายวิชา</span>
              </div>
            </CardHeader>
            <div className="flex flex-col items-start text-left">
              <CardContent >
                {courseID} - {courseName}
              </CardContent>
              <div className="flex space-x-5">
                <CardContent>{terms}</CardContent>
                <CardContent>ปีการศึกษา {years}</CardContent>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-96 h-40">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>อาจารย์ผู้สอน</span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              {academicranks} {firstName} {lastName}
            </CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-96 h-40">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>จำนวนนักศึกษาที่ลงทะเบียน</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{students}</CardContent>
          </Card>
        </div>

        <div className="flex w-full">
          <Card className="flex flex-col mt-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>ค่าเฉลี่ยของ GPA</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{Number(avg_gpa).toFixed(2)}</CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>GPA ที่มากที่สุด</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{Number(avg_max).toFixed(2)}</CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>GPA ที่น้อยที่สุด</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{Number(avg_min).toFixed(2)}</CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>ค่า Mean</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{Number(avg_mean).toFixed(2)}</CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>ค่า SD</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{Number(avg_sd).toFixed(2)}</CardContent>
          </Card>
        </div>

        <div className="flex w-full">
          <Pie gradeData={gradeData} />
          <Bar clo={clo} 
  studentAll={studentall} 
  totalPass={totalpass}  />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
