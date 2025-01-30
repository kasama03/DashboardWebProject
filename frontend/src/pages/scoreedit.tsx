import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Score } from "@/interfaces";
import { GetCourseAll } from "@/services/https/httpRequest";

interface ScoreEditProps {
  onDataChange: (data: Score) => void;
}

const ScoreEdit: React.FC<ScoreEditProps> = ({ onDataChange }) => {
  const [avg_gpa, setAvgGpa] = useState<string>("");
  const [avg_max, setAvgMax] = useState<string>("");
  const [avg_min, setAvgMin] = useState<string>("");
  const [avg_mean, setAvgMean] = useState<string>("");
  const [avg_sd, setAvgSd] = useState<string>("");
  const [scoreID, setScoreID] =  useState<string>("");

  const { CourseID, CourseName, CourseTypeID, TermID, YearID } = useParams();

  useEffect(() => {
    const fetchCourseAll = async () => {
      const storedCourseTypeID = localStorage.getItem("CourseTypeID");
        if (!storedCourseTypeID) return;
    
        const CourseTypeID = parseInt(storedCourseTypeID, 10);
        if (isNaN(CourseTypeID)) return;
        
      try {
        const res = await GetCourseAll(CourseTypeID, TermID, YearID);
        // console.log("Response from GetCourseAll score:", res);

        if (res && res.length > 0) {
          const courseInfo = res[0];
          // console.log("courseInfo", courseInfo);

          if (courseInfo) {
            const scoreData = courseInfo.Score;

            setScoreID(scoreData.ID.toString() || "");
            setAvgGpa(scoreData.AvgGpa);
            setAvgMax(scoreData.AvgMax);
            setAvgMin(scoreData.AvgMin);
            setAvgMean(scoreData.AvgMean);
            setAvgSd(scoreData.AvgSd);
          } else {
            console.error("No score data found.");
          }
        } else {
          console.error("No score data found.");
        }
      } catch (error) {
        console.error("Error fetching score data:", error);
      }
    };

    fetchCourseAll();
  }, [TermID, YearID]);

  useEffect(() => {
    const data: Score = {
      ID: parseInt(scoreID) || 0,
      AvgGpa: parseFloat(avg_gpa),
      AvgMax: parseFloat(avg_max),
      AvgMin: parseFloat(avg_min),
      AvgMean: parseFloat(avg_mean),
      AvgSd: parseFloat(avg_sd),
    };
    onDataChange(data);
  }, [scoreID, avg_gpa, avg_max, avg_min, avg_mean, avg_sd]);

  return (
    <div className="w-full">
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
                      placeholder="Enter Average GPA"
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
                      placeholder="Enter Average Max"
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
                      placeholder="Enter Average Min"
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
                      placeholder="Enter Average Mean"
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
                      placeholder="Enter Average SD"
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

export default ScoreEdit;
