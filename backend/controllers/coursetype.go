package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/entity"
)

func GetCourseTypeByType(c *gin.Context) {
	var coursetypes []entity.CourseType
	coursetype := c.Param("type")

	if err := entity.DB().Where("type = ?", coursetype).Find(&coursetypes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, coursetypes)
}

func GetCourseIDNameByType(c *gin.Context) {
	var coursetypes []entity.CourseType
	coursetype := c.Param("type")

	if err := entity.DB().Where("type = ?", coursetype).Find(&coursetypes).Raw("SELECT * FROM coursetype").Scan(&coursetypes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": coursetypes})
}