import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  CourseAll,
  Dashboard,
  CourseList,
  CourseInformationEdit,
  ScoreEdit,
  GradeEdit,
  Information,
  CloEdit,
  CourseType,
  Delete,
  DbCourseAll,
  DbCourseType,
  DashboardYear,
} from "./pages";
import CloCreate from "./component/clo/clocreate";
import CourseInformationCreate from "./component/courseinformation/courseinformationcreate";
import ScoreCreate from "./component/score/scorecreate";
import GradeCreate from "./component/grade/gradecreate";
import { Clo, CourseInformation, Grade, Score } from "./interfaces";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courseall" element={<CourseAll />} />

        <Route path="/coursetype" element={<CourseType />} />
        <Route path="/coursetype/information" element={<Information />} />
        <Route path="/coursetype/courselist/:CourseID/:CourseName/:CourseTypeID/:TermID/:YearID" element={<CourseList />} />
        <Route path="/dashboard/:CourseID/:CourseName/:CourseTypeID/:TermID/:YearID" element={<Dashboard />} />
        <Route path="/dashboardyear/:CourseID/:CourseName/:CourseTypeID/:YearID" element={<DashboardYear />} />
        <Route path="/dashboardcourseall" element={<DbCourseAll />} />
        <Route path="/dashboardcoursetype" element={<DbCourseType />} />


        {/* เส้นทางสำหรับการสร้าง */}
        <Route path="/clo" element={<CloCreate onDataChange={function (data: Clo[]): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/courseinformation" element={<CourseInformationCreate onDataChange={function (data: CourseInformation): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/score" element={<ScoreCreate onDataChange={function (data: Score): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/grade" element={<GradeCreate onDataChange={function (data: Grade): void {
          throw new Error("Function not implemented.");
        } } />} />

        {/* เส้นทางสำหรับการแก้ไขข้อมูล */}
        <Route path="/courselist/cloedit" element={<CloEdit onDataChange={function (data: Clo[]): void {
          throw new Error("Function not implemented.");
        } } CourseTypeID={0} TermID={0} YearID={0} />} />
        <Route path="/courselist/courseinformationedit" element={<CourseInformationEdit onDataChange={function (data: CourseInformation): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/courselist/scoreedit" element={<ScoreEdit onDataChange={function (data: Score): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/courselist/gradeedit" element={<GradeEdit onDataChange={function (data: Grade): void {
          throw new Error("Function not implemented.");
        } } />} />

        <Route path="/coursetype/delete" element={<Delete />} />
      </Routes>
    </Router>
  );
}

export default App;
