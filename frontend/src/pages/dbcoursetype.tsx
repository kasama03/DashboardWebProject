import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { ChartLine } from 'lucide-react';
import { GetCourseTypeByType, GetAllTerms, GetAllYears } from "@/services/https/httpRequest";
import { Button } from "@/components/ui/button";
import { Term, Year } from "@/interfaces";

interface CourseType {
  ID: number;
  CourseName: string;
  CourseID: string;
  Type: string;
}

const DbCourseType: React.FC = () => {
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

  const handleClick = async () => {
    if (selectedCourseType && selectedTerm && selectedYear) {
      const CourseTypeID = selectedCourseType.ID;
      const TermID = selectedTerm;
      const YearID = selectedYear;
      navigate(`/dashboard/${selectedCourseType.CourseID}/${selectedCourseType.CourseName}/${CourseTypeID}/${TermID}/${YearID}`);
    } else if (selectedCourseType && selectedYear) {
      const CourseTypeID = selectedCourseType.ID;
      const YearID = selectedYear;
      navigate(`/dashboardyear/${selectedCourseType.CourseID}/${selectedCourseType.CourseName}/${CourseTypeID}/${YearID}`);
    } else {
      console.error("Missing required data for navigation");
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
            <TableHead className="text-center font-medium text-sm w-[50%]">รายวิชา</TableHead>
            <TableHead className="text-center font-medium text-sm w-[50%]">แดชบอร์ด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.ID}>
              <TableCell className="text-left pl-36">
                {course.CourseID} - {course.CourseName}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <div
                      className="flex justify-center items-center"
                      onClick={() => setSelectedCourseType(course)}
                    >
                      <ChartLine className="text-black" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex justify-center">เลือกภาคการศึกษาและปีการศึกษา</DialogTitle>
                      <DialogDescription className="flex justify-center">
                        กรุณาเลือกภาคการศึกษาและปีการศึกษา หรือเลือกปีการศึกษา
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Select
                          onValueChange={(value) => setSelectedTerm(value)}
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
                          onValueChange={(value) => setSelectedYear(value)}
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
                          onClick={handleClick}
                        >
                          ดูข้อมูลแดชบอร์ด
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DbCourseType;
