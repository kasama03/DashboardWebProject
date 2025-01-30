package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kasama03/dashboard/entity"
	"github.com/kasama03/dashboard/service"


	"golang.org/x/crypto/bcrypt"
)

// LoginPayload login body
type LoginPayload struct {
	UserName 	   string `json:"user_name"`
	Password   	   string `json:"password"`
}

// LoginResponse token response
// type LoginResponse struct {
// 	Token string `json:"token"`
// 	ID    uint   `json:"id"`
// }

type LoginResponse struct {
	Token string `json:"token"`
	ID    uint   `json:"id"` 
}

// POST /login
func Login(c *gin.Context) {
	var payload LoginPayload
	var user entity.Employee

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา user ด้วย username ที่ผู้ใช้กรอกเข้ามา
	if err := entity.DB().Raw("SELECT * FROM employees WHERE user_name = ?", payload.UserName).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username dose not math"})
		return
	}

	//ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password does not match"})
		return
	}

	// กำหนดค่า SecretKey, Issuer และระยะเวลาหมดอายุของ Token สามารถกำหนดเองได้
	// SecretKey ใช้สำหรับการ sign ข้อความเพื่อบอกว่าข้อความมาจากตัวเราแน่นอน
	// Issuer เป็น unique id ที่เอาไว้ระบุตัว client
	// ExpirationHours เป็นเวลาหมดอายุของ token

	jwtWrapper := service.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(user.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	// เอามาแค่ ID
	// tokenResponse := LoginResponse{
	// 	Token: signedToken,
	// 	ID:    user.ID,
	// }

	//เอามาทั้งก้อน obj
	tokenResponse := LoginResponse{
		Token: signedToken,
		ID:    user.ID,
	}

	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
}