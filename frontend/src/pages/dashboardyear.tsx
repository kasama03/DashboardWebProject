import React, { useState, useEffect } from "react";
import Navbar from "@/component/navbar/navbar";
import {
  GetCourseDashboardYear,
  GetCourseAllbyYear,
} from "@/services/https/httpRequest";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import PieYear from "@/component/dashboard/pieyear";
import Line from "@/component/dashboard/line";

const DashboardYear: React.FC = () => {
  const { YearID } = useParams();

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
  const [avgGpaArray, setAvgGpaArray] = useState<
    { AvgGpa: number; Term: string }[]
  >([]);

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
        const res = await GetCourseAllbyYear(CourseTypeID, YearID);
        console.log(res);
        if (res && res.length > 0) {
          const courseInfo = res;
          console.log("courseinfo", courseInfo);

          const totalStudents = courseInfo.reduce(
            (
              acc: number,
              item: { CourseInformation: { StudentEnrolled: number } }
            ) => {
              const enrolled = item.CourseInformation?.StudentEnrolled || 0;
              return acc + enrolled;
            },
            0
          );

          // เก็บผลรวมไว้ใน state
          setStudents(totalStudents.toString());

          if (courseInfo) {
            const firstItem = courseInfo[0];

            // Set the values only for the first item (index 0)
            setFirstName(firstItem.CourseInformation?.TeacherFirstname || "");
            setLastName(firstItem.CourseInformation?.TeacherLastname || "");
          }

          const totalItems = res.length;
          console.log(totalItems);
          const sumGPA = res.reduce(
            (acc: number, item: { Score: { AvgGpa: number } }) =>
              acc + (item.Score.AvgGpa || 0),
            0
          );
          const sumMax = res.reduce(
            (acc: number, item: { Score: { AvgMax: number } }) =>
              acc + (item.Score.AvgMax || 0),
            0
          );
          const sumMin = res.reduce(
            (acc: number, item: { Score: { AvgMin: number } }) =>
              acc + (item.Score.AvgMin || 0),
            0
          );
          const sumMean = res.reduce(
            (acc: number, item: { Score: { AvgMean: number } }) =>
              acc + (item.Score.AvgMean || 0),
            0
          );
          const sumSD = res.reduce(
            (acc: number, item: { Score: { AvgSd: number } }) =>
              acc + (item.Score.AvgSd || 0),
            0
          );

          setAvgGpa((sumGPA / totalItems).toFixed(2));
          setAvgMax((sumMax / totalItems).toFixed(2));
          setAvgMin((sumMin / totalItems).toFixed(2));
          setAvgMean((sumMean / totalItems).toFixed(2));
          setAvgSd((sumSD / totalItems).toFixed(2));

          const avgGpaArray = courseInfo.map(
            (item: {
              Score: { AvgGpa: number };
              CourseInformation: { TermID: string };
            }) => ({
              AvgGpa: item.Score?.AvgGpa || 0,
              Term: item.CourseInformation?.TermID || "",
            })
          );
          setAvgGpaArray(avgGpaArray);

          console.log("avg", avgGpaArray);

          const gradeData = courseInfo.map(
            (item: { Grade: any }) => item.Grade
          );
          setGrades(
            gradeData.reduce(
              (acc: { [x: string]: any }, grade: { [x: string]: any }) => {
                Object.keys(acc).forEach((key) => {
                  acc[key] += grade[key] || 0;
                });
                return acc;
              },
              {
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
              }
            )
          );
        } else {
          console.error("No course data found.");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourseAll();
  }, [YearID]);

  const gradeData = Object.entries(grades).map(([name, value]) => ({
    name,
    value,
  }));

  console.log("data", gradeData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedCourseTypeID = localStorage.getItem("CourseTypeID");
      if (!storedCourseTypeID) return;

      const CourseTypeID = parseInt(storedCourseTypeID, 10);
      if (isNaN(CourseTypeID)) return;

      try {
        const res = await GetCourseDashboardYear(CourseTypeID, YearID);

        if (res && res.length > 0) {
          const data = res[0];
          console.log("dashboard", data);

          if (data) {
            const dashboardData = data;

            setYear(dashboardData.Year || "");
            setAcademicRanks(dashboardData.Ranks || "");
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
    fetchDashboardData();
  }, [YearID]);

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
              <CardContent>
                {courseID} - {courseName}
              </CardContent>
              <div className="flex space-x-5">
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
            <CardContent className="text-5xl">{avg_gpa}</CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>GPA ที่มากที่สุด</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{avg_max}</CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>GPA ที่น้อยที่สุด</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{avg_min}</CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>ค่า Mean</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{avg_mean}</CardContent>
          </Card>

          <Card className="flex flex-col mt-5 ml-5 w-[20%] h-36 justify-center">
            <CardHeader className="flex">
              <div className="font-normal text-left">
                <span>ค่า SD</span>
              </div>
            </CardHeader>
            <CardContent className="text-5xl">{avg_sd}</CardContent>
          </Card>
        </div>

        <div className="flex w-full">
          <PieYear gradeData={gradeData} />
          <Line avgGpaArray={avgGpaArray} />
        </div>
      </div>
    </div>
  );
};

export default DashboardYear;
