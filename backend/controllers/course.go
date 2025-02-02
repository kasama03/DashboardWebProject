package controllers

import (
	"fmt"
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/entity"
)

func CreateCourseAll(c *gin.Context) {

	// ตรวจสอบและ bind JSON
	type RequestBody struct {
		Course            entity.Course
		Grade             entity.Grade
		Score             entity.Score
		Clo               []entity.Clo             // Clo เป็น array สำหรับหลายรายการ
		CourseInformation entity.CourseInformation // ใช้ CourseInformation จาก entity แทน
	}

	var reqBody RequestBody
	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := govalidator.ValidateStruct(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingCourseInfo entity.CourseInformation
	if err := entity.DB().
		Where("course_type_id = ? AND term_id = ? AND year_id = ?",
			reqBody.CourseInformation.CourseTypeID,
			reqBody.CourseInformation.TermID,
			reqBody.CourseInformation.YearID).
		First(&existingCourseInfo).Error; err == nil {

		// ตรวจสอบว่า Course ที่อ้างอิง CourseInformation นี้มีอยู่แล้วหรือไม่
		var existingCourse entity.Course
		if err := entity.DB().Where("course_information_id = ?", existingCourseInfo.ID).First(&existingCourse).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "รายวิชานี้ในภาคการศึกษาและปีการศึกษานี้ถูกบันทึกข้อมูลแล้ว"})
			return
		}
	}

	// เริ่มต้นการทำงานใน transaction เพื่อให้สร้างทั้งสองตารางพร้อมกัน
	tx := entity.DB().Begin()

	//สร้าง CourseInformation
	if err := tx.Preload("Term").Preload("Year").Preload("AcademicRank").Preload("CourseType").Create(&reqBody.CourseInformation).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// สร้าง Clo ทีละรายการ
	for _, clo := range reqBody.Clo {
		if err := tx.Create(&clo).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// สร้าง Grade
	if err := tx.Create(&reqBody.Grade).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง Score
	if err := tx.Create(&reqBody.Score).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตั้งค่า foreign keys ให้กับ Course
	reqBody.Course.CourseInformationID = reqBody.CourseInformation.ID
	reqBody.Course.Clo = reqBody.Clo
	reqBody.Course.GradeID = reqBody.Grade.ID
	reqBody.Course.ScoreID = reqBody.Score.ID

	// สร้าง Course
	if err := tx.Create(&reqBody.Course).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Commit การทำงานทั้งหมดใน transaction
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"data": "Course, Grade, Score, CourseInformation, and Clo created successfully"})
}

func UpdateCourseAll(c *gin.Context) {
	type RequestBody struct {
		ID                  int
		Course              entity.Course
		Grade               entity.Grade
		Score               entity.Score
		Clo                 []entity.Clo
		CourseInformation   entity.CourseInformation
		CourseInformationID int
		GradeID             int
		ScoreID             int
	}

	var reqBody RequestBody
	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := govalidator.ValidateStruct(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	println("print", reqBody.Course.CourseInformationID)

	// เริ่ม transaction
	tx := entity.DB().Begin()

	// ค้นหาและอัปเดต CourseInformation
	var courseInfo entity.CourseInformation
	if err := tx.First(&courseInfo, reqBody.Course.CourseInformationID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "CourseInformation ไม่พบ"})
		return
	}
	if err := tx.Model(&courseInfo).Updates(reqBody.CourseInformation).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	println("courseinformation pass")

	// ค้นหาและอัปเดต Grade
	var grade entity.Grade
	if err := tx.First(&grade, reqBody.Course.GradeID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Grade ไม่พบ"})
		return
	}
	if err := tx.Model(&grade).Updates(reqBody.Grade).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	println("grade pass")

	// ค้นหาและอัปเดต Score
	var score entity.Score
	if err := tx.First(&score, reqBody.Course.ScoreID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Score ไม่พบ"})
		return
	}
	if err := tx.Model(&score).Updates(reqBody.Score).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	println("score pass")

	// อัปเดต Clo
	if len(reqBody.Clo) > 0 {
		for _, clo := range reqBody.Clo {
			if clo.ID == 0 {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Clo ID"})
				return
			}
		}
		println("clo lv1 pass")

		// ตรวจสอบและอัปเดตหรือสร้าง Clo
		for _, clo := range reqBody.Clo {
			var existingClo entity.Clo
			if err := tx.First(&existingClo, clo.ID).Error; err != nil {
				// ถ้า Clo ยังไม่มีอยู่ในฐานข้อมูล ให้สร้างใหม่
				if err := tx.Create(&clo).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
			} else {
				// ถ้ามีอยู่แล้วให้ทำการอัปเดต
				if err := tx.Model(&existingClo).Updates(clo).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
			}
		}
	}
	println("clo pass")

	// อัปเดต Course
	reqBody.Course.GradeID = reqBody.Grade.ID
	reqBody.Course.ScoreID = reqBody.Score.ID
	reqBody.Course.CourseInformationID = reqBody.CourseInformation.ID

	if err := tx.Model(&reqBody.Course).Updates(reqBody.Course).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Commit transaction
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"data": "Course, Grade, Score, CourseInformation, and Clo updated successfully"})
}

func GetCourseAll(c *gin.Context) {
	// รับพารามิเตอร์จาก query string
	CourseTypeID := c.DefaultQuery("course_type_id", "")
	TermID := c.DefaultQuery("term_id", "")
	YearID := c.DefaultQuery("year_id", "")

	// เช็คว่ามีพารามิเตอร์ที่จำเป็นครบถ้วนหรือไม่
	if CourseTypeID == "" || TermID == "" || YearID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required parameters"})
		return
	}

	// สร้างตัวแปรเพื่อเก็บข้อมูลที่ดึงมา
	var courses []entity.Course

	// ใช้ Preload เพื่อดึงข้อมูลที่เกี่ยวข้องจากตารางอื่นๆ
	if err := entity.DB().Preload("Grade").
		Preload("Score").
		Preload("CourseInformation").
		Preload("Clo.Plo").
		Preload("Clo.Pi").
		Joins("LEFT JOIN course_informations ON courses.course_information_id = course_informations.id").
		Joins("LEFT JOIN grades ON courses.grade_id = grades.id").
		Joins("LEFT JOIN scores ON courses.score_id = scores.id").
		Where("course_informations.course_type_id = ?", CourseTypeID).
		Where("course_informations.term_id = ?", TermID).
		Where("course_informations.year_id = ?", YearID).
		Find(&courses).Error; err != nil {
		// ถ้ามีข้อผิดพลาดในการดึงข้อมูล
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่ได้กลับไปยัง client โดยมีข้อมูล CourseID รวมด้วย
	// ทำให้แต่ละ course มีข้อมูล CourseID ที่เป็น ID ของตาราง Course
	// var result []map[string]interface{}
	// for _, course := range courses {
	//     result = append(result, map[string]interface{}{
	//         "CourseID": course.ID,  // ส่ง ID ของตาราง Course
	//         "Course":  course,      // ส่งข้อมูลอื่นๆ ตามที่ต้องการ
	//     })
	// }

	c.JSON(http.StatusOK, gin.H{"data": courses})
}

func GetCourseAllbyYear(c *gin.Context) {
	// รับพารามิเตอร์จาก query string
	CourseTypeID := c.DefaultQuery("course_type_id", "")
	YearID := c.DefaultQuery("year_id", "")

	// เช็คว่ามีพารามิเตอร์ที่จำเป็นครบถ้วนหรือไม่
	if CourseTypeID == "" || YearID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required parameters"})
		return
	}

	// สร้างตัวแปรเพื่อเก็บข้อมูลที่ดึงมา
	var courses []entity.Course

	// ใช้ Preload เพื่อดึงข้อมูลที่เกี่ยวข้องจากตารางอื่นๆ
	if err := entity.DB().Preload("Grade").
		Preload("Score").
		Preload("CourseInformation").
		Preload("Clo.Plo").
		Preload("Clo.Pi").
		Joins("LEFT JOIN course_informations ON courses.course_information_id = course_informations.id").
		Joins("LEFT JOIN grades ON courses.grade_id = grades.id").
		Joins("LEFT JOIN scores ON courses.score_id = scores.id").
		Where("course_informations.course_type_id = ?", CourseTypeID).
		Where("course_informations.year_id = ?", YearID).
		Find(&courses).Error; err != nil {
		// ถ้ามีข้อผิดพลาดในการดึงข้อมูล
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่ได้กลับไปยัง client
	c.JSON(http.StatusOK, gin.H{"data": courses})
}

func DeleteCourseAll(c *gin.Context) {
	// รับพารามิเตอร์จาก query string
	CourseTypeID := c.DefaultQuery("course_type_id", "")
	TermID := c.DefaultQuery("term_id", "")
	YearID := c.DefaultQuery("year_id", "")

	// เช็คว่ามีพารามิเตอร์ที่จำเป็นครบถ้วนหรือไม่
	if CourseTypeID == "" || TermID == "" || YearID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required parameters"})
		return
	}

	// เริ่มการทำงานของการลบข้อมูล
	var courses []entity.Course

	// ใช้ Preload และ Joins เพื่อดึงข้อมูลที่เกี่ยวข้องจากตารางต่างๆ
	if err := entity.DB().Preload("CourseInformation").
		Preload("Grade").
		Preload("Score").
		Preload("Clo").
		Joins("LEFT JOIN course_informations ON courses.course_information_id = course_informations.id").
		Joins("LEFT JOIN grades ON courses.grade_id = grades.id").
		Joins("LEFT JOIN scores ON courses.score_id = scores.id").
		Where("course_informations.course_type_id = ?", CourseTypeID).
		Where("course_informations.term_id = ?", TermID).
		Where("course_informations.year_id = ?", YearID).
		Where("courses.deleted_at IS NULL").
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่ามี Course ที่ตรงกับเงื่อนไขหรือไม่
	if len(courses) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No matching courses found"})
		return
	}

	// เก็บ IDs ของ Clo, Score, Grade, CourseInformation และ Course ที่ต้องการลบ
	var cloIDs []uint
	var scoreIDs []uint
	var gradeIDs []uint
	var courseInformationIDs []uint
	var courseIDs []uint

	for _, course := range courses {
		// เก็บ CourseID
		courseIDs = append(courseIDs, course.ID)

		// เก็บ CourseInformationID
		courseInformationIDs = append(courseInformationIDs, course.CourseInformationID)

		// เก็บ ScoreID
		scoreIDs = append(scoreIDs, course.ScoreID)

		// เก็บ GradeID
		gradeIDs = append(gradeIDs, course.GradeID)

		// เก็บ CloIDs
		for _, clo := range course.Clo {
			cloIDs = append(cloIDs, clo.ID)
		}
	}

	// ลบข้อมูล Clo ที่เกี่ยวข้องกับ Course
	if len(cloIDs) > 0 {
		if err := entity.DB().Where("id IN (?)", cloIDs).Delete(&entity.Clo{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// ลบข้อมูล Score ที่เกี่ยวข้องกับ Course
	if len(scoreIDs) > 0 {
		if err := entity.DB().Where("id IN (?)", scoreIDs).Delete(&entity.Score{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// ลบข้อมูล Grade ที่เกี่ยวข้องกับ Course
	if len(gradeIDs) > 0 {
		if err := entity.DB().Where("id IN (?)", gradeIDs).Delete(&entity.Grade{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// ลบข้อมูล CourseInformation ที่เกี่ยวข้องกับ Course
	if len(courseInformationIDs) > 0 {
		if err := entity.DB().Where("id IN (?)", courseInformationIDs).Delete(&entity.CourseInformation{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// ลบข้อมูล Course ที่ตรงกับเงื่อนไข
	if len(courseIDs) > 0 {
		if err := entity.DB().Where("id IN (?)", courseIDs).Delete(&entity.Course{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	// ส่งข้อมูลที่ได้กลับไปยัง client
	c.JSON(http.StatusOK, gin.H{"data": "deleted courses and related data successfully"})
}

func GetCourseDashboard(c *gin.Context) {
	// รับพารามิเตอร์จาก query string
	CourseTypeID := c.DefaultQuery("course_type_id", "")
	TermID := c.DefaultQuery("term_id", "")
	YearID := c.DefaultQuery("year_id", "")

	// เช็คว่ามีพารามิเตอร์ที่จำเป็นครบถ้วนหรือไม่
	if CourseTypeID == "" || TermID == "" || YearID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required parameters"})
		return
	}

	// println(CourseTypeID,TermID,YearID);
	// สร้างตัวแปรเพื่อเก็บข้อมูลที่ดึงมา
	var courses []struct {
		Term  string
		Year  string
		Ranks string
		ID    string
	}

	// ใช้ Preload หรือ Raw Query เพื่อดึงข้อมูลที่เกี่ยวข้องจากตารางอื่นๆ
	if err := entity.DB().Table("course_informations").
		Joins("LEFT JOIN terms ON course_informations.term_id = terms.id").
		Joins("LEFT JOIN years ON course_informations.year_id = years.id").
		Joins("LEFT JOIN academic_ranks ON course_informations.academic_rank_id = academic_ranks.id").
		Where("course_informations.course_type_id = ?", CourseTypeID).
		Where("course_informations.term_id = ?", TermID).
		Where("course_informations.year_id = ?", YearID).
		Select("terms.term AS Term, years.year AS Year, academic_ranks.academic_ranks AS Ranks, academic_ranks.id AS ID").
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// fmt.Println("Courses:", courses)
	// ส่งข้อมูลที่ได้ไปยังผู้ใช้งาน
	c.JSON(http.StatusOK, gin.H{"data": courses})
}

func GetCourseDashboardYear(c *gin.Context) {
	// รับพารามิเตอร์จาก query string
	CourseTypeID := c.DefaultQuery("course_type_id", "")
	YearID := c.DefaultQuery("year_id", "")

	// เช็คว่ามีพารามิเตอร์ที่จำเป็นครบถ้วนหรือไม่
	if CourseTypeID == "" || YearID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required parameters"})
		return
	}

	println(CourseTypeID, YearID)
	// สร้างตัวแปรเพื่อเก็บข้อมูลที่ดึงมา
	var courses []struct {
		Term  string
		Year  string
		Ranks string
		ID    string
	}

	// ใช้ Preload หรือ Raw Query เพื่อดึงข้อมูลที่เกี่ยวข้องจากตารางอื่นๆ
	if err := entity.DB().Table("course_informations").
		Joins("LEFT JOIN terms ON course_informations.term_id = terms.id").
		Joins("LEFT JOIN years ON course_informations.year_id = years.id").
		Joins("LEFT JOIN academic_ranks ON course_informations.academic_rank_id = academic_ranks.id").
		Where("course_informations.course_type_id = ?", CourseTypeID).
		Where("course_informations.year_id = ?", YearID).
		Select("terms.term AS Term, years.year AS Year, academic_ranks.academic_ranks AS Ranks, academic_ranks.id AS ID").
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Courses:", courses)
	// ส่งข้อมูลที่ได้ไปยังผู้ใช้งาน
	c.JSON(http.StatusOK, gin.H{"data": courses})
}
