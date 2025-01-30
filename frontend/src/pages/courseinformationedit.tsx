import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Term, Year, AcademicRank, CourseInformation } from "@/interfaces";
import {
  GetAllAcademicRanks,
  GetAllTerms,
  GetAllYears,
  GetCourseAll,
} from "@/services/https/httpRequest";

interface CourseInformationEditProps {
  onDataChange: (data: CourseInformation) => void;
}

const CourseInformationEdit: React.FC<CourseInformationEditProps> = ({ onDataChange }) => {
  const [academicranks, setAcademicRanks] = useState<AcademicRank[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [students, setStudents] = useState<string>(""); 
  const [firstName, setFirstName] = useState<string>(""); 
  const [lastName, setLastName] = useState<string>("");

  const [ID, setID] = useState<string>(""); 
  const [courseID, setCourseID] = useState<string>(""); 
  const [courseName, setCourseName] = useState<string>("");

  const [selectedAcademicRank, setSelectedAcademicRank] = useState<string>(""); 
  const [selectedTerm, setSelectedTerm] = useState<string>(""); 
  const [selectedYear, setSelectedYear] = useState<string>(""); 
  const [courseinformationID, setCourseinformationID] =  useState<string>("");

  const { CourseID, CourseName, CourseTypeID, TermID, YearID } = useParams();

  // ฟังก์ชันดึงข้อมูลทั้งหมด
  

  // เรียกใช้ fetchData และ fetchCourseAll เมื่อ component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const academicranksData = await GetAllAcademicRanks();
        setAcademicRanks(academicranksData);
  
        const termsData = await GetAllTerms();
        setTerms(termsData);
  
        const yearsData = await GetAllYears();
        setYears(yearsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
  const fetchCourseAll = async () => {
    const storedCourseTypeID = localStorage.getItem("CourseTypeID");
    if (!storedCourseTypeID) return;

    const CourseTypeID = parseInt(storedCourseTypeID, 10);
    if (isNaN(CourseTypeID)) return;

    try {
      const res = await GetCourseAll(CourseTypeID, TermID, YearID);
      // console.log("Response from GetCourseAll:", res);

      if (res && res.length > 0) {
        const courseInfo = res[0];
        // console.log("courseInfo", courseInfo);

        if (courseInfo) {
          const courseData = courseInfo.CourseInformation;
          setCourseinformationID(courseData.ID.toString() || "");
          setStudents(courseData.StudentEnrolled?.toString() || "");
          setFirstName(courseData.TeacherFirstname || "");
          setLastName(courseData.TeacherLastname || "");
          setSelectedTerm(courseData.TermID?.toString() || "");
          setSelectedYear(courseData.YearID?.toString() || "");
          setSelectedAcademicRank(courseData.AcademicRankID?.toString() || "");
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

  // เรียก fetchCourseAll หลังจากข้อมูลทั่วไปถูกโหลดแล้ว
  if (terms.length > 0 && years.length > 0 && academicranks.length > 0) {
    fetchCourseAll();
  }
}, [terms, years, academicranks, TermID, YearID]);

  useEffect(() => {
    const storedId = localStorage.getItem("CourseTypeID");
    if (storedId) setID(storedId);

    const storedCourseID = localStorage.getItem("CourseID");
    if (storedCourseID) setCourseID(storedCourseID.replace(/"/g, ""));

    const storedCourseName = localStorage.getItem("CourseName");
    if (storedCourseName) setCourseName(storedCourseName.replace(/"/g, ""));
  }, []);


  // ส่งข้อมูลที่อัปเดตกลับไปที่ parent component
  useEffect(() => {
    const data: CourseInformation = {
      ID: parseInt(courseinformationID) || 0,
      StudentEnrolled: parseInt(students) || 0,
      TermID: parseInt(selectedTerm) || 0,
      YearID: parseInt(selectedYear) || 0,
      CourseTypeID: parseInt(ID) || 0,
      TeacherFirstname: firstName,
      TeacherLastname: lastName,
      AcademicRankID: parseInt(selectedAcademicRank) || 0,
    };
    onDataChange(data);
  }, [courseinformationID, students, selectedTerm, selectedYear, selectedAcademicRank, firstName, lastName, ID]);

  return (
    <div className="w-full">
      <div className="flex flex-col mt-5">
        <Card>
          <CardHeader>
            <div className="font-normal text-left mt-2">
              <span>2 : ข้อมูลทั่วไปของรายวิชา</span>
            </div>
          </CardHeader>
          <CardContent className="mb-2">
            <form>
              <div className="flex space-x-20">
                {/* กลุ่มฟิลด์ทางซ้าย */}
                <div className="w-1/2 space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="courseID" className="text-left font-normal">
                      รหัสวิชา
                    </Label>
                    <Input
                      id="courseID"
                      placeholder="Enter Course ID"
                      className="w-72"
                      value={courseID}
                      onChange={(e) => setCourseID(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="courseName" className="text-left font-normal">
                      ชื่อรายวิชา
                    </Label>
                    <Input
                      id="courseName"
                      placeholder="Enter Course Name"
                      className="w-72"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="term" className="text-left font-normal">
                      ภาคการศึกษา
                    </Label>
                    <Select
                      value={selectedTerm}
                      onValueChange={(value) => setSelectedTerm(value)}
                    >
                      <SelectTrigger className="w-72">
                        <SelectValue placeholder="เลือกภาคการศึกษา" />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term.ID} value={term.ID.toString()}>
                            {term.Term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="year" className="text-left font-normal">
                      ปีการศึกษา
                    </Label>
                    <Select
                      value={selectedYear}
                      onValueChange={(value) => setSelectedYear(value)}
                    >
                      <SelectTrigger className="w-72">
                        <SelectValue placeholder="เลือกปีการศึกษา" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.ID} value={year.ID.toString()}>
                            {year.Year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* กลุ่มฟิลด์ทางขวา */}
                <div className="w-1/2 space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="teacher" className="text-left font-normal">
                      อาจารย์ผู้สอน
                    </Label>
                    <Select
                      value={selectedAcademicRank}
                      onValueChange={(value) => setSelectedAcademicRank(value)}
                    >
                      <SelectTrigger className="w-72">
                        <SelectValue placeholder="เลือกตำแหน่งทางวิชาการ" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicranks.map((rank) => (
                          <SelectItem key={rank.ID} value={rank.ID.toString()}>
                            {rank.AcademicRanks}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="first_name"
                      placeholder="Enter First Name"
                      className="w-72"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      id="last_name"
                      placeholder="Enter Last Name"
                      className="w-72"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="student_enrolled" className="text-left font-normal">
                      จำนวนนักศึกษาที่ลงทะเบียน
                    </Label>
                    <Input
                      id="student_enrolled"
                      placeholder="ระบุจำนวนนักศึกษา"
                      className="w-72"
                      value={students}
                      onChange={(e) => setStudents(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseInformationEdit;
