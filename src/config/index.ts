import devConfig from './config.dev';
import prodConfig from './config.prod';

// 判断当前环境
const ENV = process.env.NODE_ENV;

export default ENV === 'development' ? devConfig : prodConfig;
