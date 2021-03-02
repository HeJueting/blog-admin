interface IObj {
    [key: string]: any;
}

// 更新配置信息
export interface ISettingUpdate {
    _id: string;
    data: {
        // 首页第一屏背景图
        firstBacImage?: string;
        // 首页第二屏背景图
        secondBacImage?: string;
        // 首页第三屏背景图
        thirdBacImage?: string;
        // 关于我的配图
        aboutMeBacImage?: string;
        // 友情链接
        links?: any[];
        // 博客轮播图
        carsouelImages?: string[];
        // 用户评论头像配图
        commentHeaderImg?: {
            name: string;
            img: string;
        }[];
        //博客主题配置
        themeConfig?: IObj;
    };
}
