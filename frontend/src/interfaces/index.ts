import { number } from "zod";

export interface CourseType {
    ID?: number;
    CourseName: string;
    CourseID: string;
    Type: string;
}

export interface Course {
    ID?: number;
    GradeID?: number;
    ScoreID?: number;
    Clo?: Clo[];
    CourseInformationID?: number;
}

export interface CourseInformation {
    ID?: number;
    StudentEnrolled: number;
    TeacherFirstname: string;
    TeacherLastname: string;
    AcademicRankID: number;
    TermID: number;
    YearID: number;
    // TeacherID: number;
    CourseTypeID?: number;
}

export interface Term {
    ID: number;
    Term: string;
}

export interface Year {
    ID: number;
    Year: string;
}

export interface AcademicRank {
    ID: number;
    AcademicRanks: string;
}

export interface Score {
    ID?: number;
    AvgGpa: number;
    AvgMax: number;
    AvgMin: number;
    AvgMean: number;
    AvgSd: number;
}

export interface Grade {
    ID?: number;
    A: number  | null;
    Bplus: number;
    B: number;
    Cplus: number;
    C: number;
    Dplus: number;
    D: number;
    F: number;
    M: number;
    I: number;
    S: number;
    U: number;
    P: number;
    W: number;
}

export interface Clo {
    ID?: number;
    CloNo: number;
    DescriptionClo: string;
    StudentAll: number;
    TotalPass: number;
    PloID: number;
    PiID: number;
}

export interface Plo {
    ID: number;
    PloNo: number;
}

export interface Pi {
    ID: number;
    PiNo: number;
}

export interface Employee {
    UserName: string;
    Password: string;
}