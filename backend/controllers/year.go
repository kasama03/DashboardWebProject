package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/entity"
)

func GetAllYears(c *gin.Context) {
	var years []entity.Year

	if err := entity.DB().Raw("SELECT * FROM years").Scan(&years).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": years})
}
