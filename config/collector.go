package config

type CollectorJson struct {
	AutoCollect        bool             `json:"auto_collect"` // 是否自动采集
	ErrorTimes         int              `json:"error_times"`  //预留
	Channels           int              `json:"channels"`     //预留
	CollectMode        int              `json:"collect_mode"` // 0: 采集, 1: 组合
	FromEngine         string           `json:"from_engine"`
	Language           string           `json:"language"`     // zh|en|cr
	InsertImage        bool             `json:"insert_image"` // 是否插入图片
	Images             []string         `json:"images"`
	FromWebsite        string           `json:"from_website"`
	TitleMinLength     int              `json:"title_min_length"`
	ContentMinLength   int              `json:"content_min_length"`
	TitleExclude       []string         `json:"title_exclude"`
	TitleExcludePrefix []string         `json:"title_exclude_prefix"`
	TitleExcludeSuffix []string         `json:"title_exclude_suffix"`
	ContentExcludeLine []string         `json:"content_exclude_line"`
	ContentExclude     []string         `json:"content_exclude"`
	LinkExclude        []string         `json:"link_exclude"`
	ContentReplace     []ReplaceKeyword `json:"content_replace"`
	AutoPseudo         bool             `json:"auto_pseudo"`   //是否伪原创
	CategoryId         uint             `json:"category_id"`   //默认分类
	SaveType           uint             `json:"save_type"`     // 文档处理方式
	StartHour          int              `json:"start_hour"`    //每天开始时间
	EndHour            int              `json:"end_hour"`      //每天结束时间
	DailyLimit         int              `json:"daily_limit"`   //每日限额
	CustomPatten       []*CustomPatten  `json:"custom_patten"` // 自定义采集匹配
}

type ReplaceKeyword struct {
	From string `json:"from"`
	To   string `json:"to"`
}

type CustomPatten struct {
	Domain         string           `json:"domain"`
	TitlePatten    string           `json:"title_patten"`
	ContentPatten  string           `json:"content_patten"`
	TitleReplace   []ReplaceKeyword `json:"title_replace"`
	ContentReplace []ReplaceKeyword `json:"content_replace"`
}

var DefaultCollectorConfig = CollectorJson{
	AutoCollect:      false,
	ErrorTimes:       5,
	Channels:         2,
	TitleMinLength:   10,
	ContentMinLength: 400,
	AutoPseudo:       false,
	CategoryId:       0,
	SaveType:         0,
	StartHour:        8,
	EndHour:          20,
	DailyLimit:       1000,
	TitleExclude: []string{
		"法律声明",
		"站点地图",
		"区长信箱",
		"政务服务",
		"政务公开",
		"领导介绍",
		"首页",
		"当前页",
		"当前位置",
		"来源：",
		"点击：",
		"关注我们",
		"浏览次数",
		"信息分类",
		"索引号",
	},
	TitleExcludePrefix: []string{
		"404",
		"403",
	},
	TitleExcludeSuffix: []string{
		"网",
		"政府",
		"门户",
	},
	ContentExcludeLine: []string{
		"背景色：",
		"时间：",
		"作者：",
		"来源：",
		"编辑：",
		"时间:",
		"来源:",
		"作者:",
		"编辑:",
		"摄影：",
		"摄影:",
		"本文地址",
		"原文地址",
		"微信：",
		"微信:",
		"官方微信",
		"一篇：",
		"相关附件",
		"qrcode",
		"微信扫一扫",
		"用手机浏览",
		"打印正文",
		"浏览次数",
		"举报/反馈",
		"展开全文",
		"资料来源/",
		"编辑/",
		"文/",
		"关注央视网",
		"©",
		"（记者",
		"相关文章",
		"相关推荐",
		"原作者所有",
		"专题推荐",
		"随机推荐",
		"了解详情",
		"了解更多",
		"查看更多",
		"来源网络",
		"转载请",
	},
	LinkExclude: []string{
		"查看更多",
	},
	CustomPatten: []*CustomPatten{
		{
			Domain:        "mp.weixin.qq.com",
			TitlePatten:   "h1",
			ContentPatten: "#js_content",
		},
		{
			Domain:        "zhihu.com",
			TitlePatten:   "h1",
			ContentPatten: ".RichContent-inner .RichText,.Post-RichTextContainer .RichText",
		},
		{
			Domain:        "toutiao.com",
			TitlePatten:   "h1",
			ContentPatten: ".article-content article",
		},
	},
}
