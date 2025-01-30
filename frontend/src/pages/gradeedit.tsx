import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Grade } from "@/interfaces";
import { GetCourseAll } from "@/services/https/httpRequest";

interface GradeEditProps {
  onDataChange: (data: Grade) => void;
}

const GradeEdit: React.FC<GradeEditProps> = ({ onDataChange }) => {
  const [a, setA] = useState<string>("");
  const [bplus, setBplus] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [cplus, setCplus] = useState<string>("");
  const [c, setC] = useState<string>("");
  const [dplus, setDplus] = useState<string>("");
  const [d, setD] = useState<string>("");
  const [f, setF] = useState<string>("");
  const [m, setM] = useState<string>("");
  const [i, setI] = useState<string>("");
  const [s, setS] = useState<string>("");
  const [u, setU] = useState<string>("");
  const [p, setP] = useState<string>("");
  const [w, setW] = useState<string>("");
  const [gradeID, setGradeID] =  useState<string>("");

  const { CourseID, CourseName, CourseTypeID, TermID, YearID } = useParams();

  useEffect(() => {
    const fetchCourseAll = async () => {
      const storedCourseTypeID = localStorage.getItem("CourseTypeID");
        if (!storedCourseTypeID) return;
    
        const CourseTypeID = parseInt(storedCourseTypeID, 10);
        if (isNaN(CourseTypeID)) return;

        try {
          const res = await GetCourseAll(CourseTypeID, TermID, YearID);
          // console.log("Response from GetCourseAll grade:", res);

          if (res && res.length > 0) {
            const courseInfo = res[0];
          // console.log("courseInfo grade", courseInfo);

          if (courseInfo) {
            const gradeData = courseInfo.Grade;

            setGradeID(gradeData.ID.toString() || "");
            setA(gradeData.A);
        setBplus(gradeData.Bplus);
        setB(gradeData.B);
        setCplus(gradeData.Cplus);
        setC(gradeData.C);
        setDplus(gradeData.Dplus);
        setD(gradeData.D);
        setF(gradeData.F);
        setM(gradeData.M);
        setI(gradeData.I);
        setS(gradeData.S);
        setU(gradeData.U);
        setP(gradeData.P);
        setW(gradeData.W);
          } else {
            console.error("No grade data found.");
          }
          } else {
            console.error("No grade data found.");
          }
        } catch (error) {
          console.error("Error fetching grade data:", error);
        }
    };

    fetchCourseAll();
  }, [TermID, YearID]);

  useEffect(() => {
    const data: Grade = {
      ID: parseInt(gradeID) || 0,
      A: Number(a),
      Bplus: Number(bplus),
      B: Number(b),
      Cplus: Number(cplus),
      C: Number(c),
      Dplus: Number(dplus),
      D: Number(d),
      F: Number(f),
      M: Number(m),
      I: Number(i),
      S: Number(s),
      U: Number(u),
      P: Number(p),
      W: Number(w),
    };
    onDataChange(data);
  }, [gradeID, a, bplus, b, cplus, c, dplus, d, f, m, i, s, u, p ,w]);

  return (
    <div className="w-full">
      <div className="flex flex-col mt-5">
        <Card>
          <CardHeader>
            <div className="font-normal text-left mt-2">
              <span>4 : จำนวนนักศึกษาที่ได้ผลการเรียนในแต่ละระดับ</span>
            </div>
          </CardHeader>
          <CardContent className="mb-2">
            <form>
              <div className="flex space-x-20">
                <div className="w-1/2 space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="a" className="text-left font-normal">
                      A
                    </Label>
                    <Input
                      id="a"
                      placeholder="Enter Average GPA"
                      className="w-72"
                      value={a}
                      onChange={(e) => setA(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="bplus" className="text-left font-normal">
                      B+
                    </Label>
                    <Input
                      id="bplus"
                      placeholder="Enter Average Max"
                      className="w-72"
                      value={bplus}
                      onChange={(e) => setBplus(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="b" className="text-left font-normal">
                      B
                    </Label>
                    <Input
                      id="b"
                      placeholder="Enter Average Min"
                      className="w-72"
                      value={b}
                      onChange={(e) => setB(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="cplus" className="text-left font-normal">
                      C+
                    </Label>
                    <Input
                      id="cplus"
                      placeholder="Enter Average Min"
                      className="w-72"
                      value={cplus}
                      onChange={(e) => setCplus(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="c" className="text-left font-normal">
                      C
                    </Label>
                    <Input
                      id="c"
                      placeholder="Enter Average Min"
                      className="w-72"
                      value={c}
                      onChange={(e) => setC(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="dplus" className="text-left font-normal">
                      D+
                    </Label>
                    <Input
                      id="dplus"
                      placeholder="Enter Average Min"
                      className="w-72"
                      value={dplus}
                      onChange={(e) => setDplus(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="d" className="text-left font-normal">
                      D
                    </Label>
                    <Input
                      id="d"
                      placeholder="Enter Average Min"
                      className="w-72"
                      value={d}
                      onChange={(e) => setD(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-1/2 space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="f" className="text-left font-normal">
                      F
                    </Label>
                    <Input
                      id="f"
                      placeholder="Enter Average Mean"
                      className="w-72"
                      value={f}
                      onChange={(e) => setF(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="m" className="text-left font-normal">
                      M
                    </Label>
                    <Input
                      id="m"
                      placeholder="Enter Average SD"
                      className="w-72"
                      value={m}
                      onChange={(e) => setM(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="i" className="text-left font-normal">
                      I
                    </Label>
                    <Input
                      id="i"
                      placeholder="Enter Average SD"
                      className="w-72"
                      value={i}
                      onChange={(e) => setI(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="s" className="text-left font-normal">
                      S
                    </Label>
                    <Input
                      id="s"
                      placeholder="Enter Average SD"
                      className="w-72"
                      value={s}
                      onChange={(e) => setS(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="u" className="text-left font-normal">
                      U
                    </Label>
                    <Input
                      id="u"
                      placeholder="Enter Average SD"
                      className="w-72"
                      value={u}
                      onChange={(e) => setU(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="p" className="text-left font-normal">
                      P
                    </Label>
                    <Input
                      id="p"
                      placeholder="Enter Average SD"
                      className="w-72"
                      value={p}
                      onChange={(e) => setP(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="w" className="text-left font-normal">
                      W
                    </Label>
                    <Input
                      id="w"
                      placeholder="Enter Average SD"
                      className="w-72"
                      value={w}
                      onChange={(e) => setW(e.target.value)}
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

export default GradeEdit;
