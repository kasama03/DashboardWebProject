import { CourseInformation, Clo, Score, Grade, Course } from "@/interfaces";

const apiUrl = "http://localhost:8080";

async function UpdateCourseAll(Grade: Grade, Course: Course, Score: Score, CourseInformation: CourseInformation, Clo: Clo[]) {
  const data = {Grade, Course, Score, CourseInformation, Clo };
  console.log('request', data)
  const requestOptions = {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },

    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/updatecourseall`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.data };
      }
    });
  return res;
}

async function GetCourseTypeByType(type: string | undefined) {
  const requestOptions = {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/coursetype/${type}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      console.log("res",res)
      if (res) {
        return res;
      } else {
        return false;
      }
    });
  return res;
}

async function GetAllYears() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/years`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function GetAllTerms() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/terms`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function GetAllPlos() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/plos`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function GetAllPis() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/pis`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function GetAllAcademicRanks() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/academicranks`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function CreateCourseAll(grade: Grade, score: Score, clo: Clo[], courseinformation: CourseInformation, course: Course) {
  const data = { grade, score, clo, courseinformation, course };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(`${apiUrl}/createtablecourse`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });
  return response;
}

async function GetCourseAll(CourseTypeID: number | undefined, TermID: string | undefined, YearID: string | undefined) {
  const requestOptions = {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/getcourseall?course_type_id=${CourseTypeID}&term_id=${TermID}&year_id=${YearID}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function GetCourseAllbyYear(CourseTypeID: number | undefined, YearID: string | undefined) {
  const requestOptions = {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/getcourseallbyyear?course_type_id=${CourseTypeID}&year_id=${YearID}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function DeleteCourseAll(CourseTypeID: number, TermID: number, YearID: number) {
  const requestOptions = {
    method: "DELETE", // เปลี่ยนจาก GET เป็น DELETE
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // เพิ่ม Authorization header
    },
  };

  // ส่งคำขอลบข้อมูล
  let res = await fetch(`${apiUrl}/deletecourseall?course_type_id=${CourseTypeID}&term_id=${TermID}&year_id=${YearID}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data; // หากลบสำเร็จจะคืนค่าข้อมูลที่ตอบกลับ
      } else {
        return false; // หากไม่สำเร็จจะคืนค่า false
      }
    });

  return res;
}

async function GetCourseDashboard(CourseTypeID: number | undefined, TermID: string | undefined, YearID: string | undefined) {
  const requestOptions = {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/getcoursedashboard?course_type_id=${CourseTypeID}&term_id=${TermID}&year_id=${YearID}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function GetCourseDashboardYear(CourseTypeID: number | undefined, YearID: string | undefined) {
  const requestOptions = {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/getcoursedashboardyear?course_type_id=${CourseTypeID}&&year_id=${YearID}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

async function LoginService(data : {user_name:String, password:String}) {
  console.log(data)
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/login`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, data: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}

export {
  GetCourseTypeByType,
  GetAllYears,
  GetAllTerms,
  GetAllPlos,
  GetAllPis,
  GetAllAcademicRanks,
  CreateCourseAll,
  UpdateCourseAll,
  GetCourseAll,
  GetCourseAllbyYear,
  DeleteCourseAll,
  GetCourseDashboard,
  GetCourseDashboardYear,
  LoginService,
};
