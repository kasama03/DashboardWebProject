import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/component/navbar/navbar";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CloCreate from "@/component/clo/clocreate";
import { Clo, Grade, Score, Course, CourseInformation } from "@/interfaces";
import { CreateCourseAll } from "@/services/https/httpRequest";
import CourseInformationCreate from "@/component/courseinformation/courseinformationcreate";
import ScoreCreate from "@/component/score/scorecreate";
import GradeCreate from "@/component/grade/gradecreate";

const Information: React.FC = () => {
  const [cloData, setCloData] = useState<Clo[]>([]);
  const [couseinformationData, setcouseinformationData] = useState<CourseInformation | null>(null);
  const [scoreData, setScoreData] = useState<Score | null>(null);
  const [gradeData, setGradeData] = useState<Grade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  const handleCloDataChange = (data: Clo[]) => {
    setCloData(data);
  };

  const handleCourseInformationDataChange = (data: CourseInformation) => {
    setcouseinformationData(data);
  };

  const handleScoreDataChange = (data: Score) => {
    setScoreData(data);
  };

  const handleGradeDataChange = (data: Grade) => {
    setGradeData(data);
  };

  const handleSave = async () => {
    // Validate data first
    if (cloData.length > 0 && couseinformationData && scoreData && gradeData) {
      
      setDialogTitle('ยืนยันการบันทึกข้อมูล');
      setDialogMessage('คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?');
      setDialogType('success');
      setIsDialogOpen(true);
    } else {
      setDialogTitle('ไม่สามารถบันทึกข้อมูลได้');
      setDialogMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      setDialogType('error');
      setIsDialogOpen(true);
    }
  };
  
  const handleDialogConfirm = async () => {
    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!gradeData || !scoreData || !cloData || !couseinformationData) {
      setDialogTitle('Error');
      setDialogMessage('Missing required data. Please fill in all fields.');
      setDialogType('error');
      setIsDialogOpen(true);
      return;
    }
  
    // Step 3: Create courseData using the provided data
    const courseData: Course = {
      GradeID: 1,
      ScoreID: 1,
      Clo: cloData,
      CourseInformationID: 1,
    };
  
    
    // Step 4: Create course and check response
    const courseResponse = await CreateCourseAll(gradeData, scoreData, cloData, couseinformationData, courseData);
    console.log("courseres", couseinformationData)
    console.log("res", gradeData, scoreData, cloData, couseinformationData, courseData)
    if (!courseResponse.status) {
      setDialogTitle('error');
      setDialogMessage(courseResponse.message);
      console.log(courseResponse.message);
      setDialogType('error');
      setIsDialogOpen(true);
      return;
    }
  
    // Close the dialog and navigate to /courseall
    setIsDialogOpen(false);
    navigate("/courseall");
  };
  

  return (
    <div className="w-full">
      <Navbar />
      <div className="flex flex-col">
        <CloCreate onDataChange={handleCloDataChange} />
      </div>
      <div className="flex flex-col">
        <CourseInformationCreate onDataChange={handleCourseInformationDataChange} />
      </div>
      <div className="flex flex-col">
        <ScoreCreate onDataChange={handleScoreDataChange} />
      </div>
      <div className="flex flex-col">
        <GradeCreate onDataChange={handleGradeDataChange} />
      </div>
      <div className="flex justify-end mt-5">
        <Button className="button-secondary w-72 font-medium" onClick={handleSave}>
          บันทึก
        </Button>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">{dialogTitle}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="font-medium text-left text-base">{dialogMessage}</AlertDialogDescription>
          <AlertDialogFooter className="flex justify-between w-full items-center">
            <AlertDialogCancel className="button-default w-32 font-medium" onClick={() => setIsDialogOpen(false)}>
              ยกเลิก
            </AlertDialogCancel>
            {dialogType === 'success' && (
              <AlertDialogAction className="button-secondary w-32 font-medium" onClick={handleDialogConfirm}>
                ตกลง
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Information;
