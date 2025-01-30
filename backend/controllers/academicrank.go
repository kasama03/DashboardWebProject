package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/entity"
)

func GetAllAcademicRanks(c *gin.Context) {
	var academicranks []entity.AcademicRank

	if err := entity.DB().Raw("SELECT * FROM academic_ranks").Scan(&academicranks).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": academicranks})
}