package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/entity"
)

func GetAllPlos(c *gin.Context) {
	var plos []entity.Plo

	if err := entity.DB().Raw("SELECT * FROM plos").Scan(&plos).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": plos})
}