package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/entity"
)

func GetAllPis(c *gin.Context) {
	var pis []entity.Pi

	if err := entity.DB().Raw("SELECT * FROM pis").Scan(&pis).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": pis})
}