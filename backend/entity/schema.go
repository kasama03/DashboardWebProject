package entity

import (
	"gorm.io/gorm"
)

type CourseType struct {
	gorm.Model
	CourseName string `gorm:"not null"`
	CourseID   string `gorm:"not null"`
	Type       string `gorm:"not null"`
}

type Course struct {
	gorm.Model
	GradeID uint
	Grade   Grade `gorm:"foreignKey:GradeID" valid:"-"`
	ScoreID uint
	Score   Score `gorm:"foreignKey:ScoreID" valid:"-"`
	// CloID           uint
	// Clo                      []Clo   `gorm:"foreignKey:CloID"`
	Clo                 []Clo `gorm:"many2many:course_clos;"`
	CourseInformationID uint
	CourseInformation   CourseInformation `gorm:"foreignKey:CourseInformationID" valid:"-"`
}

type CourseInformation struct {
	gorm.Model
	StudentEnrolled  int    `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ลงทะเบียน, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	TeacherFirstname string `validate:"required~กรุณากรอกชื่ออาจารย์ผู้สอน"`
	TeacherLastname  string `validate:"required~กรุณากรอกนามสกุลอาจารย์ผู้สอน"`
	TermID           *uint
	Term             Term `gorm:"foreignKey:TermID"`
	YearID           *uint
	Year             Year `gorm:"foreignKey:YearID"`
	// TeacherID       uint
	// Teacher         Teacher `gorm:"foreignKey:TeacherID"`
	AcademicRankID *uint
	AcademicRank   AcademicRank `gorm:"foreignKey:AcademicRankID"`
	CourseTypeID   *uint
	CourseType     CourseType `gorm:"foreignKey:CourseTypeID"`
}

type Term struct {
	gorm.Model
	Term string `gorm:"not null" validate:"required~กรุณาเลือกภาคการศึกษา"`
}

type Year struct {
	gorm.Model
	Year string `gorm:"not null" validate:"required~กรุณาเลือกปีการศึกษา"`
}

type AcademicRank struct {
	gorm.Model
	AcademicRanks string `gorm:"not null" validate:"required~กรุณาเลือกตำแหน่งทางวิชาการ"`
}

type Score struct {
	gorm.Model
	AvgGpa  float64 `gorm:"type:float(32)" validate:"required~กรุณากรอกข้อมูลค่าเฉลี่ยของ GPA, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	AvgMax  float64 `gorm:"type:float(32)" validate:"required~กรุณากรอกข้อมูลค่าเฉลี่ยของ GPA ที่มากที่สุด, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	AvgMin  float64 `gorm:"type:float(32)" validate:"required~กรุณากรอกข้อมูลค่าเฉลี่ยของ GPA ที่น้อยที่สุด, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	AvgMean float64 `gorm:"type:float(32)" validate:"required~กรุณากรอกข้อมูลค่าเฉลี่ยของค่า Mean, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	AvgSd   float64 `gorm:"type:float(32)" validate:"required~กรุณากรอกข้อมูลค่าเฉลี่ยของค่า SD, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
}

type Grade struct {
	gorm.Model
	A     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ A, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	Bplus int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ B+, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	B     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ B, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	Cplus int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ C+, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	C     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ C, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	Dplus int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ D+, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	D     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ D, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	F     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ F, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	M     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ M, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	I     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ I, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	S     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ S, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	U     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ U, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	P     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ P, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	W     int `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ได้ผลการเรียนในระดับ W, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
}

type Clo struct {
	gorm.Model
	CloNo          int    `gorm:"type:int" validate:"required~กรุณากรอกข้อมูล CLO, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	DescriptionClo string `validate:"required~กรุณากรอกข้อมูลรายละเอียดของ CLO"`
	StudentAll     int    `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาทั้งหมด, gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	TotalPass      int    `gorm:"type:int" validate:"required~กรุณากรอกข้อมูลจำนวนนักศึกษาที่ผ่าน (%), gte=0~ต้องมีค่ามากกว่าหรือเท่ากับ 0"`
	PloID          uint
	Plo            Plo `gorm:"foreignKey:PloID"`
	PiID           uint
	Pi             Pi `gorm:"foreignKey:PiID"`
}

type Plo struct {
	gorm.Model
	PloNo uint `gorm:"not null" validate:"required~กรุณาเลือก PLO"`
}

type Pi struct {
	gorm.Model
	PiNo uint `gorm:"not null" validate:"required~กรุณาเลือก PI"`
}

type Employee struct {
	gorm.Model
	UserName string `gorm:"type:varchar(50);unique" validate:"required~กรุณากรอกชื่อบัญชีผู้ใช้, stringlength(3|50)~ต้องมีความยาว 3-50 ตัวอักษร"`
	Password string `gorm:"type:varchar(60)" validate:"required~กรุณากรอกรหัสผ่าน, stringlength(8|16)~ต้องมีความยาว 8-16 ตัวอักษร"`
}
