package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/controllers"
	"github.com/kasama03/dashboard/entity"
)

func main() {
	// ตั้งค่า database
	entity.SetupDatabase()

	// สร้าง router ด้วย Gin
	r := gin.Default()

	r.Use(CORSMiddleware())
	r.POST("/login", controllers.Login)

	router := r.Group("")
	{
		// ตั้งค่าเส้นทาง (routes)
		router.GET("/coursetype/:type", controllers.GetCourseTypeByType)
		router.GET("/years", controllers.GetAllYears)
		router.GET("/terms", controllers.GetAllTerms)
		router.GET("/plos", controllers.GetAllPlos)
		router.GET("/pis", controllers.GetAllPis)
		router.GET("/academicranks", controllers.GetAllAcademicRanks)

		router.POST("/createtablecourse", controllers.CreateCourseAll)
		router.PUT("/updatecourseall", controllers.UpdateCourseAll)
		router.GET("/getcourseall", controllers.GetCourseAll)
		router.GET("/getcourseallbyyear", controllers.GetCourseAllbyYear)
		router.DELETE("/deletecourseall", controllers.DeleteCourseAll)
		router.GET("/getcoursedashboard", controllers.GetCourseDashboard)
		router.GET("/getcoursedashboardyear", controllers.GetCourseDashboardYear)
	}
	// รันเซิร์ฟเวอร์ที่พอร์ต 8080
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
