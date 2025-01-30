import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import Navbar from "@/component/navbar/navbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Term, Year, AcademicRank, CourseInformation } from "@/interfaces";
import {
  GetAllAcademicRanks,
  GetAllTerms,
  GetAllYears,
} from "@/services/https/httpRequest";

interface CourseInformationCreateProps {
  onDataChange: (data: CourseInformation) => void;
}

const CourseInformationCreate: React.FC<CourseInformationCreateProps> = ({
  onDataChange,
}) => {
  const [academicranks, setAcademicRanks] = useState<AcademicRank[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [students, setStudents] = useState<string>("");
  const [ID, setID] = useState<string>("");
  const [courseID, setCourseID] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [selectedAcademicRank, setSelectedAcademicRank] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

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
    const storedId = localStorage.getItem("CourseTypeID");
    const storedCourseID = localStorage.getItem("CourseID");
    const storedCourseName = localStorage.getItem("CourseName");
    console.log(storedId, storedCourseID, storedCourseName);
    if (storedId) setID(storedId);

    if (storedCourseID) {
      const storedCourseID2 = storedCourseID.replace(/"/g, "");
      setCourseID(storedCourseID2);
    }

    if (storedCourseName) {
      // เอาเครื่องหมายคำพูดออก
      const storedCourseName2 = storedCourseName.replace(/"/g, "");
      setCourseName(storedCourseName2);
    }
  }, []);

  useEffect(() => {
    const data: CourseInformation = {
      StudentEnrolled: parseInt(students) || 0,
      TermID: parseInt(selectedTerm) || 0,
      YearID: parseInt(selectedYear) || 0,
      CourseTypeID: parseInt(ID) || 0,
      // CourseID:			courseID,
      // CourseName:			courseName,
      TeacherFirstname: firstName,
      TeacherLastname: lastName,
      AcademicRankID: parseInt(selectedAcademicRank) || 0,
    };
    onDataChange(data);
    console.log(data);
  }, [
    students,
    selectedTerm,
    selectedYear,
    selectedAcademicRank,
    firstName,
    lastName,
    ID,
  ]);

  return (
    <div className="w-full">
      <Navbar></Navbar>
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
                  {/* ฟิลด์ Course ID */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="courseID" className="text-left font-normal">
                      รหัสวิชา
                    </Label>
                    <Input
                      id="courseID"
                      placeholder=" "
                      className="w-72"
                      value={courseID}
                      onChange={(e) => setCourseID(e.target.value)}
                    />
                  </div>
                  {/* ฟิลด์ Course Name */}
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="courseName"
                      className="text-left font-normal"
                    >
                      ชื่อรายวิชา
                    </Label>
                    <Input
                      id="courseName"
                      placeholder=" "
                      className="w-72"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                    />
                  </div>
                  {/* ฟิลด์ Term */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="term" className="text-left font-normal">
                      ภาคการศึกษา
                    </Label>
                    <Select
                      onValueChange={(value) => setSelectedTerm(value)}
                      value={selectedTerm}
                    >
                      <SelectTrigger id="term" className="w-72 bg-white">
                        <SelectValue placeholder="เลือกภาคการศึกษา" />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term.ID} value={term.ID?.toString()}>
                            {term.Term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* ฟิลด์ Year */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="year" className="text-left font-normal">
                      ปีการศึกษา
                    </Label>
                    <Select
                      onValueChange={(value) => setSelectedYear(value)}
                      value={selectedYear}
                    >
                      <SelectTrigger id="year" className="w-72 bg-white">
                        <SelectValue placeholder="เลือกปีการศึกษา" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.ID} value={year.ID?.toString()}>
                            {year.Year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* กลุ่มฟิลด์ทางขวา */}
                <div className="w-1/2 space-y-6">
                  {/* ฟิลด์ Teacher */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="teacher" className="text-left font-normal">
                      อาจารย์ผู้สอน
                    </Label>

                    <Select
                      onValueChange={(value) => setSelectedAcademicRank(value)}
                      value={selectedAcademicRank}
                    >
                      <SelectTrigger
                        id="academic_ranks"
                        className="w-72 bg-white"
                      >
                        <SelectValue placeholder="เลือกตำแหน่งทางวิชาการ" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicranks.map((academicrank) => (
                          <SelectItem
                            key={academicrank.ID}
                            value={academicrank.ID?.toString()}
                          >
                            {academicrank.AcademicRanks}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex flex-col">
                      <Label className="text-left font-normal mt-4">
                        ชื่อ :
                      </Label>
                      <Input
                        id="first_name"
                        placeholder=" "
                        className="w-72 mt-2"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label className="text-left font-normal mt-4">
                        นามสกุล :
                      </Label>
                      <Input
                        id="last_name"
                        placeholder=" "
                        className="w-72 mt-2"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* ฟิลด์ Student Enrolled */}
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="student_enrolled"
                      className="text-left font-normal"
                    >
                      จำนวนนักศึกษาที่ลงทะเบียน
                    </Label>
                    <Input
                      id="student_enrolled"
                      placeholder=" "
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

export default CourseInformationCreate;
