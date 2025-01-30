import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/component/navbar/navbar";
import { UpdateCourseAll, DeleteCourseAll, GetCourseAll } from "@/services/https/httpRequest";
import { Clo, Grade, Score, Course, CourseInformation } from "@/interfaces";
import CloEdit from "./cloedit";
import CourseInformationEdit from "./courseinformationedit";
import ScoreEdit from "./scoreedit";
import GradeEdit from "./gradeedit";
import { Button } from "@/components/ui/button";
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

const CourseList: React.FC = () => {
  const [cloData, setCloData] = useState<Clo[]>([]);
  const [courseinformationData, setCourseInformationData] = useState<CourseInformation | null>(null);
  const [scoreData, setScoreData] = useState<Score | null>(null);
  const [gradeData, setGradeData] = useState<Grade | null>(null);
  const [courseID, setCourseID] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { CourseID, CourseName, CourseTypeID, TermID, YearID } = useParams();

  const handleCloDataChange = (updatedData: Clo[]) => {
    setCloData(updatedData);
  };

  const handleCourseInformationDataChange = (updatedData: CourseInformation) => {
    setCourseInformationData(updatedData);
  };

  const handleScoreDataChange = (updatedData: Score) => {
    setScoreData(updatedData);
  };

  const handleGradeDataChange = (updatedData: Grade) => {
    setGradeData(updatedData);
  };

  useEffect(() => {
    const fetchCourseAll = async () => {
      const storedCourseTypeID = localStorage.getItem("CourseTypeID");
      if (!storedCourseTypeID) return;

      const CourseTypeID = parseInt(storedCourseTypeID, 10);
      if (isNaN(CourseTypeID)) return;

      try {
        const res = await GetCourseAll(CourseTypeID, TermID, YearID);
        if (res && res.length > 0) {
          const courseInfo = res[0];
          if (courseInfo) {
            setCourseID(courseInfo.ID);
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseAll();
  }, [TermID, YearID]);

  const handleUpdate = async () => {
    if (!gradeData || !scoreData || !cloData.length || !courseinformationData) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนก่อนอัปเดต");
      return;
    }

    if (!courseID) {
      alert("ไม่พบข้อมูล Course ID");
      return;
    }

    if (courseinformationData.ID === 0) {
      alert("ไม่พบข้อมูล Course Information ที่ต้องการอัปเดต");
      return;
    }

    const courseData: Course = {
      ID: courseID,
      GradeID: gradeData.ID,
      ScoreID: scoreData.ID,
      CourseInformationID: courseinformationData.ID,
    };

    setDialogTitle('ยืนยันการแก้ไขข้อมูล');
    setDialogMessage('คุณต้องการบันทึกการแก้ไขข้อมูลใช่หรือไม่ ?');
    setDialogType('success');
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateConfirm = async () => {
    if (!gradeData || !scoreData || !cloData.length || !courseinformationData || !courseID) {
      alert("ข้อมูลไม่ครบถ้วน");
      return;
    }

    const courseData: Course = {
      ID: courseID,
      GradeID: gradeData.ID,
      ScoreID: scoreData.ID,
      CourseInformationID: courseinformationData.ID,
    };

    try {
      const response = await UpdateCourseAll(gradeData, courseData, scoreData, courseinformationData, cloData);

      if (response.status) {
        setDialogTitle('ยืนยันการแก้ไขข้อมูล');
        setDialogMessage('บันทึกการแก้ไขข้อมูลสำเร็จ');
        setDialogType('success');
        setTimeout(() => navigate('/courseall')); // เพิ่มการหน่วงเวลา 1 วินาที
      } else {
        setDialogTitle('ข้อผิดพลาด');
        setDialogMessage('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
        setDialogType('error');
      }
      setIsUpdateDialogOpen(false);
    } catch (error) {
      setDialogTitle('ข้อผิดพลาด');
      setDialogMessage('เกิดข้อผิดพลาดขณะอัปเดตข้อมูล');
      setDialogType('error');
      setIsUpdateDialogOpen(false);
    }
  };

  const handleDeleteClick = () => {
    if (!CourseTypeID || !TermID || !YearID) {
      alert("ไม่สามารถลบข้อมูลได้");
      return;
    }

    setDialogTitle('ยืนยันการลบข้อมูล');
    setDialogMessage('คุณต้องการลบข้อมูลนี้ใช่หรือไม่?');
    setDialogType('success');
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!CourseTypeID || !TermID || !YearID) {
      alert("ข้อมูลไม่ถูกต้อง");
      return;
    }

    const parsedCourseTypeID = parseInt(CourseTypeID, 10);
    const parsedTermID = parseInt(TermID, 10);
    const parsedYearID = parseInt(YearID, 10);

    try {
      const response = await DeleteCourseAll(parsedCourseTypeID, parsedTermID, parsedYearID);
      if (!response.status) {
        setDialogTitle('ยืนยันการลบข้อมูล');
        setDialogMessage('ลบข้อมูลสำเร็จ');
        setDialogType('success');
        setTimeout(() => navigate('/courseall')); // เพิ่มการหน่วงเวลา 1 วินาที
      } else {
        setDialogTitle('ข้อผิดพลาด');
        setDialogMessage('เกิดข้อผิดพลาดในการลบข้อมูล');
        setDialogType('error');
      }
      setIsUpdateDialogOpen(false);
    } catch (error) {
      setDialogTitle('ข้อผิดพลาด');
      setDialogMessage('เกิดข้อผิดพลาดขณะลบข้อมูล');
      setDialogType('error');
      setIsUpdateDialogOpen(false);
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="flex flex-col">
        <CloEdit onDataChange={handleCloDataChange} />
      </div>
      <div className="flex flex-col">
        <CourseInformationEdit onDataChange={handleCourseInformationDataChange} />
      </div>
      <div className="flex flex-col">
        <ScoreEdit onDataChange={handleScoreDataChange} />
      </div>
      <div className="flex flex-col">
        <GradeEdit onDataChange={handleGradeDataChange} />
      </div>
      <div className="flex space-x-4 mt-5 justify-end">
        <Button className="button-secondary w-72 font-medium" onClick={handleUpdate}>
          บันทึกการแก้ไข
        </Button>
        <Button className="button-secondary w-72 font-medium" onClick={handleDeleteClick}>
          ลบข้อมูล
        </Button>
      </div>

      {/* Alert Dialog for Confirm Update */}
      <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="button-default w-32 font-medium" onClick={() => setIsUpdateDialogOpen(false)}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction className="button-secondary w-32 font-medium" onClick={handleUpdateConfirm}>
              ตกลง
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for Confirm Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="button-default w-32 font-medium" onClick={() => setIsDeleteDialogOpen(false)}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction className="button-secondary w-32 font-medium" onClick={handleDeleteConfirm}>
              ตกลง
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseList;
