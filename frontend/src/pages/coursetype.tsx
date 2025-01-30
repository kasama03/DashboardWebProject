import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import Navbar from "@/component/navbar/navbar";
import { Link } from "react-router-dom";
import { SquarePen, FilePlus2 } from "lucide-react";
import { SquareX } from "lucide-react";
import { GetCourseTypeByType, GetAllTerms, GetAllYears, GetCourseAll, DeleteCourseAll } from "@/services/https/httpRequest";
import { useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Term, Year } from "@/interfaces";

interface CourseType {
  ID: number;
  CourseName: string;
  CourseID: string;
  Type: string;
}

const CourseType: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCourseType, setSelectedCourseType] = useState<CourseType | null>(null);
  const location = useLocation();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const navigate = useNavigate();
  const [courseID, setCourseID] = useState<number | null>(null); // เก็บ ID ของ Course
  // const { CourseID, CourseName, CourseTypeID, TermID, YearID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type) {
          const coursesData = await GetCourseTypeByType(type);
          if (coursesData) setCourses(coursesData);
        }

        const termsData = await GetAllTerms();
        setTerms(termsData);

        const yearsData = await GetAllYears();
        setYears(yearsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [type]);

  const handleEditClick = async () => {
    if (selectedCourseType && selectedTerm && selectedYear) {
      const CourseTypeID = selectedCourseType.ID;
      const TermID = selectedTerm; // แปลงค่า term เป็นตัวเลข
      const YearID = selectedYear; // แปลงค่า year เป็นตัวเลข
  console.log('yearid', YearID)
      // นำค่าเหล่านี้ไปส่งใน state ของ navigate
      navigate(`/coursetype/courselist/${selectedCourseType.CourseID}/${selectedCourseType.CourseName}/${CourseTypeID}/${TermID}/${YearID}`);
    } else {
      console.error("missing required data for editing");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ffffff",
        backgroundSize: "cover",
        backgroundPosition: "center",
        margin: 0,
        padding: 0,
      }}
    >
      <Navbar />
      <Table className="w-full mt-6">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-medium text-sm w-[60%]">รายวิชา</TableHead>
            <TableHead className="text-center font-medium text-sm w-[20%]">เพิ่มข้อมูล</TableHead>
            <TableHead className="text-center font-medium text-sm w-[20%]">แก้ไขข้อมูล / ลบข้อมูล</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.ID}>
              <TableCell className="text-left pl-36">
                {course.CourseID} - {course.CourseName}
              </TableCell>
              <TableCell>
                <Link
                  onClick={() => {
                    localStorage.setItem("CourseTypeID", JSON.stringify(course.ID));
                    localStorage.setItem("CourseID", JSON.stringify(course.CourseID));
                    localStorage.setItem("CourseName", JSON.stringify(course.CourseName));
                  }}
                  to={`/coursetype/information`}
                  className="flex justify-center items-center"
                >
                  <FilePlus2 className="text-black" />
                </Link>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <div
                      className="flex justify-center items-center"
                      onClick={() => setSelectedCourseType(course)}
                    >
                      <SquarePen className="text-black" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex justify-center">เลือกภาคการศึกษาและปีการศึกษา</DialogTitle>
                      <DialogDescription className="flex justify-center">
                        กรุณาเลือกข้อมูลภาคการศึกษาและปีการศึกษาที่ต้องการแก้ไข
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Select
                          onValueChange={(value) => setSelectedTerm((value))}
                          value={selectedTerm?.toString() || ""}
                        >
                          <SelectTrigger id="term" className="w-72 bg-white">
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
                      <div className="flex justify-center">
                        <Select
                          onValueChange={(value) => setSelectedYear((value))}
                          value={selectedYear?.toString() || ""}
                        >
                          <SelectTrigger id="year" className="w-72 bg-white">
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
                      <div className="flex justify-center">
                        <Button
                          className="button-secondary w-72"
                          onClick={handleEditClick}
                        >
                          แก้ไขข้อมูล
                        </Button>
                      </div>

                      {/* <div className="flex justify-center">
                        <Button
                          className="button-secondary w-72"
                          onClick={handleEditClick}
                        >
                          ลบข้อมูล
                        </Button>
                      </div> */}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
              {/* <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <div
                      className="flex justify-center items-center"
                      onClick={() => setSelectedCourseType(course)}
                    >
                      <SquareX className="text-black" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex justify-center">เลือกภาคการศึกษาและปีการศึกษา</DialogTitle>
                      <DialogDescription className="flex justify-center">
                        กรุณาเลือกข้อมูลภาคการศึกษาและปีการศึกษาที่ต้องการลบ
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Select
                          onValueChange={(value) => setSelectedTerm((value))}
                          value={selectedTerm?.toString() || ""}
                        >
                          <SelectTrigger id="term" className="w-72 bg-white">
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
                      <div className="flex justify-center">
                        <Select
                          onValueChange={(value) => setSelectedYear((value))}
                          value={selectedYear?.toString() || ""}
                        >
                          <SelectTrigger id="year" className="w-72 bg-white">
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
                      <div className="flex justify-center">
                        <Button
                          className="button-secondary w-72"
                          // onClick={handleDeleteClick}
                        >
                          ลบข้อมูล
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseType;
