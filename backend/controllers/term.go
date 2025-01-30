package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/entity"
)

func GetAllTerms(c *gin.Context) {
	var terms []entity.Term

	if err := entity.DB().Raw("SELECT * FROM terms").Scan(&terms).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": terms})
}