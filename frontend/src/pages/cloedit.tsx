import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plo, Pi, Clo } from "@/interfaces";
import { GetAllPlos, GetAllPis, GetCourseAll } from "@/services/https/httpRequest";

interface CloEditProps {
  onDataChange: (data: Clo[]) => void;
}

const CloEdit: React.FC<CloEditProps> = ({ onDataChange }) => {
  const [plo, setPlos] = useState<Plo[]>([]);
  const [pi, setPis] = useState<Pi[]>([]);
  const [rows, setRows] = useState([
    {
      selectedPlo: "",
      selectedPi: "",
      clo_no: "",
      description_clo: "",
      student_all: "",
      total_pass: "",
    },
  ]);
  const [ploupdate, setPloupdate] = useState<number[]>([]);
  const [piupdate, setPiupdate] = useState<number[]>([]);
  const [cloupdate, setCloupdate] = useState<number[]>([]);
  const [descriptionupdate, setDescriptionupdate] = useState<string[]>([]);
  const [studentupdate, setStudentupdate] = useState<number[]>([]);
  const [totalUpdateClo, setTotalupdate] = useState<number[]>([]);
  const [cloID, setCloID] =  useState<string>("");

  const { CourseID, CourseName, CourseTypeID, TermID, YearID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plosData = await GetAllPlos();
        setPlos(plosData);
        const pisData = await GetAllPis();
        setPis(pisData);
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
          // console.log("Response from GetCourseAll clo:", res);
    
          if (res && res.length > 0) {
            const courseInfo = res[0];
            // console.log("courseInfo clo", courseInfo);
    
            if (courseInfo) {
              const cloData = courseInfo.Clo;
    
              // ตรวจสอบและตั้งค่า Clo เดี่ยว
              if (cloData && cloData.length > 0) {
                setCloID(cloData[0].ID || "");
                setPloupdate(cloData[0].PloID || "");
                setPiupdate(cloData[0].PiID || "");
                setCloupdate(cloData[0].CloNo || "");
                setDescriptionupdate(cloData[0].DescriptionClo || "");
                setStudentupdate(cloData[0].StudentAll || "");
                setTotalupdate(cloData[0].TotalPass || "");
    
                // อัปเดต rows ด้วยข้อมูล Clo ทั้งหมด
                const updatedRows = cloData.map((clo: { PloID: { toString: () => any; }; PiID: { toString: () => any; }; CloNo: { toString: () => any; }; DescriptionClo: any; StudentAll: { toString: () => any; }; TotalPass: { toString: () => any; }; }) => ({
                  selectedPlo: clo.PloID?.toString() || "",
                  selectedPi: clo.PiID?.toString() || "",
                  clo_no: clo.CloNo?.toString() || "",
                  description_clo: clo.DescriptionClo || "",
                  student_all: clo.StudentAll?.toString() || "",
                  total_pass: clo.TotalPass?.toString() || "",
                }));
                setRows(updatedRows);
                console.log("Updated Rows:", updatedRows);
              } else {
                console.error("No clo data found.");
              }
            }
          } else {
            console.error("No course data found.");
          }
        } catch (error) {
          console.error("Error fetching clo data:", error);
        }
      };
    
      fetchCourseAll();
    }, [TermID, YearID]); // อัปเดตเมื่อ TermID หรือ YearID เปลี่ยน
    

  useEffect(() => {
    const data: Clo[] = rows.map((row) => ({
      ID: parseInt(cloID) || 0,
      CloNo: parseInt(row.clo_no) || 0,
      DescriptionClo: row.description_clo,
      StudentAll: parseInt(row.student_all) || 0,
      TotalPass: parseInt(row.total_pass) || 0,
      PloID: parseInt(row.selectedPlo) || 0,
      PiID: parseInt(row.selectedPi) || 0,
    }));
    onDataChange(data);
  }, [rows, onDataChange]);

  const handleRowChange = (
    index: number,
    field:
      | "selectedPlo"
      | "selectedPi"
      | "clo_no"
      | "description_clo"
      | "student_all"
      | "total_pass",
    value: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col mt-10">
        <Card>
          <CardHeader>
            <div className="font-normal text-left mt-2">
              <span>1 : ข้อมูล CLO ของรายวิชา</span>
            </div>
          </CardHeader>
          <CardContent className="mb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-center">PLO</TableHead>
                  <TableHead className="font-medium text-center">PI</TableHead>
                  <TableHead className="font-medium text-center">CLO</TableHead>
                  <TableHead className="font-medium text-center">
                    รายละเอียด
                  </TableHead>
                  <TableHead className="font-medium text-center">
                    จำนวนนักศึกษาทั้งหมด
                  </TableHead>
                  <TableHead className="font-medium text-center">
                    จำนวนนักศึกษาที่ผ่าน (%)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        onValueChange={(value) =>
                          handleRowChange(index, "selectedPlo", value)
                        }
                        value={row.selectedPlo}
                      >
                        <SelectTrigger className="w-72 bg-white">
                          <SelectValue placeholder="เลือก PLO" />
                        </SelectTrigger>
                        <SelectContent>
                          {plo.map((ploItem) => (
                            <SelectItem
                              key={ploItem.ID}
                              value={ploItem.ID.toString()}
                            >
                              {ploItem.ID}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) =>
                          handleRowChange(index, "selectedPi", value)
                        }
                        value={row.selectedPi}
                      >
                        <SelectTrigger className="w-72 bg-white">
                          <SelectValue placeholder="เลือก PI" />
                        </SelectTrigger>
                        <SelectContent>
                          {pi.map((piItem) => (
                            <SelectItem
                              key={piItem.ID}
                              value={piItem.ID.toString()}
                            >
                              {piItem.ID}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.clo_no}
                        onChange={(e) =>
                          handleRowChange(index, "clo_no", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.description_clo}
                        onChange={(e) =>
                          handleRowChange(index, "description_clo", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.student_all}
                        onChange={(e) =>
                          handleRowChange(index, "student_all", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.total_pass}
                        onChange={(e) =>
                          handleRowChange(index, "total_pass", e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CloEdit;
