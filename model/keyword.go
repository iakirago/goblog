package model

import (
	"gorm.io/gorm"
)

type Keyword struct {
	Model
	Title        string `json:"title" gorm:"column:title;type:varchar(250) not null;default:'';unique"`
	Status       uint   `json:"status" gorm:"column:status;type:tinyint(1) unsigned not null;default:0;index:idx_status"`
	CategoryId   uint   `json:"category_id" gorm:"column:category_id;type:int(10) unsigned not null;default:0;index:idx_category_id"`
	Level        int    `json:"level" gorm:"column:level;type:int(10);default:0"`
	ArticleCount int64  `json:"article_count" gorm:"column:article_count;type:int(10);default:0;index"`
	HasDig       int    `json:"has_dig" gorm:"column:has_dig;type:tinyint(1);default:0"`
	LastTime     int64  `json:"last_time" gorm:"column:last_time;type:int(10);default:0;index"` //上次采集文章执行时间
}

func (keyword *Keyword) Save(db *gorm.DB) error {
	if err := db.Save(keyword).Error; err != nil {
		return err
	}

	return nil
}

func (keyword *Keyword) Delete(db *gorm.DB) error {
	if err := db.Delete(keyword).Error; err != nil {
		return err
	}

	return nil
}
