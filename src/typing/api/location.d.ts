// 创建location
export interface ILocationCreate {
    time: number;
    name: string;
    lat: string;
    lng: string;
}

// 更新location
export interface ILocationUpdate {
    id: string;
    data: {
        time: number;
        name: string;
        lat: string;
        lng: string;
    };
}

// 删除location
export interface ILocationDelete {
    id: string;
}
