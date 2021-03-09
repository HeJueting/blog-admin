// 服务端地址
const server_url = 'http://127.0.0.1:7070';

const devConfig = {
    // 发布时间
    PUBLISH_TIME: 1609430400000,
    // 服务端请求地址
    REQUEST_BASE_URL: server_url,
    // 文件请求地址
    FILE_REQUEST_PATH: `${server_url}/minio/frontend/access/file`,
    // 图片请求地址
    IMAGE_REQUEST_PATH: `${server_url}/minio/frontend/access/image`,
    // 博客前端登录地址
    BLOG_LOGIN_URL: 'http://localhost/blog/login',
};

export default devConfig;
