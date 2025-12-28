// เตรียมไฟล์ handler สำหรับ klon (กลอน) ที่นี่
		log.Fatal("ไม่สามารถโหลด timezone ได้:", err)
	}

	convertTimesToUserTimezone(&product, loc)

	c.JSON(http.StatusOK, product)
}

func (h *ProductHandlers) AddProduct(c *gin.Context) {
	var product product.NewProduct
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdProduct, err := h.store.AddProduct(c.Request.Context(), product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdProduct)
}

func (h *ProductHandlers) GetProductImages(c *gin.Context) {
	id := c.Param("id") // รับค่า id เป็น string

	images, err := h.store.GetProductImages(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, images)
}

func (h *ProductHandlers) AddProductImage(c *gin.Context) {
	id := c.Param("id") // รับค่า id เป็น string

	var image product.NewProductImage
	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdImage, err := h.store.AddProductImage(c.Request.Context(), id, image)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdImage)
}

func (h *ProductHandlers) UpdateProduct(c *gin.Context) {
	id := c.Param("id")

	var update product.UpdateProduct
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedProduct, err := h.store.UpdateProduct(c.Request.Context(), id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedProduct)
}

func (h *ProductHandlers) DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	if err := h.store.DeleteProduct(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ProductHandlers) UpdateProductImage(c *gin.Context) {
	id := c.Param("id")            // รับค่า id เป็น string
	imageID := c.Param("image_id") // รับค่า imageID เป็น string

	var update product.UpdateProductImage
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedImage, err := h.store.UpdateProductImage(c.Request.Context(), id, imageID, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedImage)
}

func (h *ProductHandlers) DeleteProductImage(c *gin.Context) {
	id := c.Param("id")            // รับค่า id เป็น string
	imageID := c.Param("image_id") // รับค่า imageID เป็น string

	if err := h.store.DeleteProductImage(c.Request.Context(), id, imageID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *ProductHandlers) GetCategories(c *gin.Context) {
	// ดึงรายการหมวดหมู่จากฐานข้อมูล (ในตัวอย่างนี้ยังไม่มีการเชื่อมต่อฐานข้อมูล)
	categories := []string{"Electronics", "Books", "Clothing"}
	c.JSON(http.StatusOK, categories)
}

func (h *ProductHandlers) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "healthy"})
}
