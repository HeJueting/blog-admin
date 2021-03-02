// 创建文章分类
export interface IArticleCategoryCreate {
    description: string;
    isPublic: boolean;
    name: string;
    parentId: string;
}

// 更新文章分类
export interface IArticleCategoryUpdate {
    _id: string;
    description?: string;
    isPublic?: boolean;
    name?: string;
    parentId?: string;
    sort?: number;
}

// 删除文章分类
export interface IArticleCategoryDelete {
    _id: string;
}
