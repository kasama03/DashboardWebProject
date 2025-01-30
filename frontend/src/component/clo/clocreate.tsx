import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button"; // Import Button component
import { Plo, Pi, Clo } from "@/interfaces";
import { GetAllPlos, GetAllPis } from "@/services/https/httpRequest";

interface CloCreateProps {
  onDataChange: (data: Clo[]) => void;
}

const CloCreate: React.FC<CloCreateProps> = ({ onDataChange }) => {
  const [plo, setPlos] = useState<Plo[]>([]);
  const [pi, setPis] = useState<Pi[]>([]);
  const [rows, setRows] = useState([{ selectedPlo: "", selectedPi: "", clo_no: "", description_clo: "", student_all: "", total_pass: "" }]);

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
    const data: Clo[] = rows.map((row) => ({
      CloNo: parseInt(row.clo_no) || 0,
      DescriptionClo: row.description_clo,
      StudentAll: parseInt(row.student_all) || 0,
      TotalPass: parseInt(row.total_pass) || 0,
      PloID: parseInt(row.selectedPlo) || 0,
      PiID: parseInt(row.selectedPi) || 0,
    }));
    onDataChange(data);
  }, [rows, onDataChange]);

  const handleAddRow = () => {
    setRows([...rows, { selectedPlo: "", selectedPi: "", clo_no: "", description_clo: "", student_all: "", total_pass: "" }]);
  };

  const handleRowChange = (
    index: number,
    field: "selectedPlo" | "selectedPi" | "clo_no" | "description_clo" | "student_all" | "total_pass",
    value: string
  ) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index][field] = value;
      return newRows;
    });
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
                  <TableHead className="font-medium text-center w-[20%]">PLO</TableHead>
                  <TableHead className="font-medium text-center w-[20%]">PI</TableHead>
                  <TableHead className="font-medium text-center w-[20%]">CLO</TableHead>
                  <TableHead className="font-medium text-center w-[20%]">รายละเอียด</TableHead>
                  <TableHead className="font-medium text-center w-[10%]">จำนวนนักศึกษาทั้งหมด</TableHead>
                  <TableHead className="font-medium text-center w-[10%]">จำนวนนักศึกษาที่ผ่าน (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        onValueChange={(value) => handleRowChange(index, "selectedPlo", value)}
                        value={row.selectedPlo}
                      >
                        <SelectTrigger id={`plo_no_${index}`} className="w-72 bg-white">
                          <SelectValue placeholder="เลือก PLO" />
                        </SelectTrigger>
                        <SelectContent>
                          {plo.map((plo) => (
                            <SelectItem key={plo.ID} value={plo.PloNo?.toString()}>
                              {plo.PloNo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) => handleRowChange(index, "selectedPi", value)}
                        value={row.selectedPi}
                      >
                        <SelectTrigger id={`pi_no_${index}`} className="w-72 bg-white">
                          <SelectValue placeholder="เลือก Pi" />
                        </SelectTrigger>
                        <SelectContent>
                          {pi.map((pi) => (
                            <SelectItem key={pi.ID} value={pi.PiNo?.toString()}>
                              {pi.PiNo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        id={`clo_no_${index}`}
                        placeholder=" "
                        className="w-full"
                        value={row.clo_no}
                        onChange={(e) => handleRowChange(index, "clo_no", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        id={`description_clo_${index}`}
                        placeholder=" "
                        className="w-full"
                        value={row.description_clo}
                        onChange={(e) => handleRowChange(index, "description_clo", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        id={`student_all${index}`}
                        placeholder=" "
                        className="w-full"
                        value={row.student_all}
                        onChange={(e) => handleRowChange(index, "student_all", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        id={`total_pass${index}`}
                        placeholder=" "
                        className="w-full"
                        value={row.total_pass}
                        onChange={(e) => handleRowChange(index, "total_pass", e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
            <Button onClick={handleAddRow} className="button-secondary w-32 font-medium text-center">
              เพิ่มแถว
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CloCreate;