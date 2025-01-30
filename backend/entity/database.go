package entity

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	// "github.com/kasama03/dashboard/entity"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Global database instance
var db *gorm.DB

// DB returns the global database instance
func DB() *gorm.DB {
	return db
}

// SetupDatabase sets up and initializes the database
func SetupDatabase() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Read database configuration from environment variables
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s TimeZone=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
		os.Getenv("DB_TIMEZONE"),
	)

	
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	
	db = database

	db.AutoMigrate(&CourseType{}, &Term{}, &Year{}, &Plo{}, &Pi{}, &AcademicRank{}, &Score{}, &Grade{}, &Clo{}, &CourseInformation{}, &Course{}, &Employee{})
	fmt.Println("Database migration completed!")

	// Seed data
	seedData()
	fmt.Println("test ",dsn)
}

// Seed function to add initial data
func seedData() {
	coursetypes := []CourseType{
		{CourseName: "COMPUTER PROGRAMMING I", CourseID: "523101", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},
		{CourseName: "COMPUTER PROGRAMMING II", CourseID: "523201", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},
		{CourseName: "COMPUTER STATISTICS", CourseID: "523301", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},
		{CourseName: "ENGINEERING GRAPHICS I", CourseID: "525101", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},
		{CourseName: "ENGINEERING MATERIALS", CourseID: "531101", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},
		{CourseName: "COMPUTER PROGRAMMING I", CourseID: "ENG23 1001", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},
		{CourseName: "COMPUTER PROGRAMMING II", CourseID: "ENG23 2001", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},
		{CourseName: "ENGINEERING GRAPHICS I", CourseID: "ENG25 1010", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},
		{CourseName: " ENGINEERING MATERIALS", CourseID: "ENG31 1001", Type: "วิชาพื้นฐานทางวิศวกรรมศาสตร์"},

		{CourseName: "PROBLEM SOLVING WITH PROGRAMMING", CourseID: " 523203", Type: "ด้านเทคโนโลยีเพื่องานประยุกต์"},
		{CourseName: "DATABASE SYSTEMS", CourseID: "523211", Type: "ด้านเทคโนโลยีเพื่องานประยุกต์"},
		{CourseName: "COMPUTER ENGINEERING PROJECT", CourseID: "523480", Type: "ด้านเทคโนโลยีเพื่องานประยุกต์"},

		{CourseName: "DATA STRUCTURES AND ALGORITHMS", CourseID: "523231", Type: "ด้านเทคโนโลยีและวิธีการทางซอฟต์แวร์"},
		{CourseName: "OBJECT-ORIENTED TECHNOLOGY", CourseID: "523232", Type: "ด้านเทคโนโลยีและวิธีการทางซอฟต์แวร์"},
		{CourseName: "SYSTEM ANALYSIS AND DESIGN", CourseID: "523331", Type: "ด้านเทคโนโลยีและวิธีการทางซอฟต์แวร์"},
		{CourseName: "SOFTWARE ENGINEERING", CourseID: "523332", Type: "ด้านเทคโนโลยีและวิธีการทางซอฟต์แวร์"},

		{CourseName: "PROGRAMMING FUNDAMENTALS", CourseID: "523251", Type: "ด้านโครงสร้างพื้นฐานของระบบ"},
		{CourseName: "FORMAL METHODS AND COMPUTABILITY", CourseID: "523351", Type: "ด้านโครงสร้างพื้นฐานของระบบ"},
		{CourseName: "COMPUTER AND COMMUNICATION", CourseID: "523352", Type: "ด้านโครงสร้างพื้นฐานของระบบ"},
		{CourseName: "COMPUTER NETWORKS", CourseID: "523353", Type: "ด้านโครงสร้างพื้นฐานของระบบ"},
		{CourseName: "OPERATING SYSTEMS", CourseID: "523354", Type: "ด้านโครงสร้างพื้นฐานของระบบ"},

		{CourseName: "ELECTRONICS FOR COMPUTER ENGINEERING", CourseID: "523271", Type: "ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์"},
		{CourseName: "ELECTRONIC LABORATORY FOR COMPUTER ENGINEERING", CourseID: "523272", Type: "ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์"},
		{CourseName: "DIGITAL SYSTEM DESIGN", CourseID: "523273", Type: "ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์"},
		{CourseName: "DIGITAL SYSTEM LABORATORY", CourseID: "523274", Type: "ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์"},
		{CourseName: "COMPUTER MATHEMATICS", CourseID: "523275", Type: "ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์"},
		{CourseName: "COMPUTER ARCHITECTURE AND ORGANIZATION", CourseID: "523276", Type: "ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์"},
		{CourseName: "MICROPROCESSORS", CourseID: "523371", Type: "ด้านฮาร์ดแวร์และสถาปัตยกรรมคอมพิวเตอร์"},

		{CourseName: "STATISTICAL ANALYSIS", CourseID: "523302", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "KNOWLEDGE DISCOVERY AND DATA MINING", CourseID: "523312", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "WEB APPLICATIONS", CourseID: "523313", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "MACHINE LEARNING FUNDAMENTALS", CourseID: "523315", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "BUSINESS INTELLIGENCE", CourseID: "523316", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "EVENT-DRIVEN PROGRAMMING", CourseID: "523333", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "INTRODUCTION TO BLOCKCHAIN TECHNOLOGY", CourseID: "523355", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "EMBEDDED SYSTEMS", CourseID: "523372", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "ADVANCED DIGITAL SYSTEM DESIGN", CourseID: "523373", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "SERVERLESS AND CLOUD ARCHITECTURES", CourseID: "523374", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "INTELLIGENT METHODOLOGIES", CourseID: "523403", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "ARTIFICIAL INTELLIGENCE IN APPLICATIONS", CourseID: "523411", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "EXPERT SYSTEMS", CourseID: "523412", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "ARTIFICIAL NEURAL NETWORKS", CourseID: "523414", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "SEMANTIC WEB", CourseID: "523415", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "COMPUTER AND DATA ANALYSIS", CourseID: "523416", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "HEALTH AND ENVIRONMENTAL INFORMATICS", CourseID: "523417", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "DEEP LEARNING", CourseID: "523418", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "ADVANCED WEB APPLICATION DEVELOPMENT", CourseID: "523419", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "SOFTWARE TESTING", CourseID: "523423", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "SOFTWARE PROCESS", CourseID: "523435", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "CYBER SECURITY FUNDAMENTALS", CourseID: "523441", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "ADVANCED CYBER SECURITY", CourseID: "523442", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "COMPUTER GRAPHICS", CourseID: "523451", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "DIGITAL IMAGE PROCESSING", CourseID: "523452", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "COMPUTER VISION", CourseID: "523453", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "COMPUTER NETWORK PROGRAMMING", CourseID: "523454", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "COMPUTER SECURITY", CourseID: "523455", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "OPEN SOURCE DEVELOPMENT", CourseID: "523456", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "ALGORITHM ANALYSIS AND DESIGN", CourseID: "523460", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "OPTIMIZATION METHODS", CourseID: "523471", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "NUMERICAL ANALYSIS", CourseID: "523472", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "MICRO ROBOT DEVELOPMENT", CourseID: "523473", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "SPECIAL PROBLEMS IN COMPUTER ENGINEERING I", CourseID: "523481", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "SPECIAL PROBLEMS IN COMPUTER ENGINEERING II", CourseID: "523482", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "ADVANCED TOPICS IN COMPUTER ENGINEERING I", CourseID: "523497", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "ADVANCED TOPICS IN COMPUTER ENGINEERING II", CourseID: "523498", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "INTRODUCTION TO RESEARCH METHODS", CourseID: "523499", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
		{CourseName: "INTRODUCTION TO DATA ENGINEERING", CourseID: "ENG23 3017", Type: "กลุ่มวิชาเลือกทางวิศวกรรมคอมพิวเตอร์"},
	}

	for _, coursetype := range coursetypes {
		newCourseType := coursetype
		db.FirstOrCreate(&newCourseType, CourseType{CourseID: coursetype.CourseID})
	}

	terms := []Term{
		{Term: "ภาคการศึกษาที่ 1"},
		{Term: "ภาคการศึกษาที่ 2"},
		{Term: "ภาคการศึกษาที่ 3"},
	}

	for _, term := range terms {
		db.FirstOrCreate(&term, &Term{Term: term.Term})
	}

	years := []Year{
		{Year: "2565"},
		{Year: "2566"},
		{Year: "2567"},
	}

	for _, year := range years {
		db.FirstOrCreate(&year, &Year{Year: year.Year})
	}

	plos := []Plo{
		{PloNo: 1},
		{PloNo: 2},
		{PloNo: 3},
		{PloNo: 4},
		{PloNo: 5},
		{PloNo: 6},
	}
	
	for _, plo := range plos {
		db.FirstOrCreate(&plo, Plo{PloNo: plo.PloNo})
	}
	
	pis := []Pi{
		{PiNo: 1},
		{PiNo: 2},
		{PiNo: 3},
		{PiNo: 4},
		{PiNo: 5},
		{PiNo: 6},
	}
	
	for _, pi := range pis {
		db.FirstOrCreate(&pi, Pi{PiNo: pi.PiNo})
	}
	

	academic_ranks := []AcademicRank{
		{AcademicRanks: "ผู้ช่วยศาสตราจารย์ ดร."},
		{AcademicRanks: "รองศาสตราจารย์ ดร."},
		{AcademicRanks: "อาจารย์ ดร."},
	}
	
	for _, academic_rank := range academic_ranks {
		db.FirstOrCreate(&academic_rank, AcademicRank{AcademicRanks: academic_rank.AcademicRanks})
	}

	employees := []Employee{
		{UserName: "kasama", Password: "ksm123456"},
	}

	for _, employee := range employees {
		employee.Password = hashPassword(employee.Password)
		db.FirstOrCreate(&employee, Employee{UserName: employee.UserName})
	}
}

func hashPassword(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Error hashing password: ", err)
	}
	return string(hashedPassword)
}