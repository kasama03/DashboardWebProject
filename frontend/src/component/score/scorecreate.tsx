import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/component/navbar/navbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Score } from "@/interfaces";

interface ScoreCreateProps {
  onDataChange: (data: Score) => void;
}

const ScoreCreate: React.FC<ScoreCreateProps> = ({ onDataChange }) => {
  const [avg_gpa, setAvgGpa] = useState<string>("");
  const [avg_max, setAvgMax] = useState<string>("");
  const [avg_min, setAvgMin] = useState<string>("");
  const [avg_mean, setAvgMean] = useState<string>("");
  const [avg_sd, setAvgSd] = useState<string>("");

  useEffect(() => {
    const data: Score = {
      AvgGpa: parseFloat(avg_gpa),
      AvgMax: parseFloat(avg_max),
      AvgMin: parseFloat(avg_min),
      AvgMean: parseFloat(avg_mean),
      AvgSd: parseFloat(avg_sd),
    };
    onDataChange(data);
  }, [avg_gpa, avg_max, avg_min, avg_mean, avg_sd]);

  return (
    <div className="w-full">
      <Navbar></Navbar>
      <div className="flex flex-col mt-5">
        <Card>
          <CardHeader>
            <div className="font-normal text-left mt-2">
              <span>3 : ค่าเฉลี่ยของผลการเรียน</span>
            </div>
          </CardHeader>
          <CardContent className="mb-2">
            <form>
              <div className="flex space-x-20">
                {/* กลุ่มฟิลด์ทางซ้าย */}
                <div className="w-1/2 space-y-6">
                  {/* ฟิลด์ Avg gpa */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="avg_gpa" className="text-left font-normal">
                      ค่าเฉลี่ยของ GPA
                    </Label>
                    <Input
                      id="avg_gpa"
                      placeholder=" "
                      className="w-72"
                      value={avg_gpa}
                      onChange={(e) => setAvgGpa(e.target.value)}
                    />
                  </div>
                  {/* ฟิลด์ Avg Max */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="avg_max" className="text-left font-normal">
                      GPA ที่มากที่สุด
                    </Label>
                    <Input
                      id="avg_max"
                      placeholder=" "
                      className="w-72"
                      value={avg_max}
                      onChange={(e) => setAvgMax(e.target.value)}
                    />
                  </div>
                  {/* ฟิลด์ Avg Min */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="avg_min" className="text-left font-normal">
                      GPA ที่น้อยที่สุด
                    </Label>
                    <Input
                      id="avg_min"
                      placeholder=" "
                      className="w-72"
                      value={avg_min}
                      onChange={(e) => setAvgMin(e.target.value)}
                    />
                  </div>
                </div>

                {/* กลุ่มฟิลด์ทางขวา */}
                <div className="w-1/2 space-y-6">
                  {/* ฟิลด์ Avg Mean */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="avg_mean" className="text-left font-normal">
                      ค่า Mean
                    </Label>
                    <Input
                      id="avg_mean"
                      placeholder=" "
                      className="w-72"
                      value={avg_mean}
                      onChange={(e) => setAvgMean(e.target.value)}
                    />
                  </div>
                  {/* ฟิลด์ Avg sd */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="avg_sd" className="text-left font-normal">
                      ค่า SD
                    </Label>
                    <Input
                      id="avg_sd"
                      placeholder=" "
                      className="w-72"
                      value={avg_sd}
                      onChange={(e) => setAvgSd(e.target.value)}
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

export default ScoreCreate;
