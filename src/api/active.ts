import Axios from '../utils/axios';

const activeAxios = {
    // 登录次数+1
    addLogin: () =>
        Axios({
            method: 'get',
            url: '/active/admin/addLogin',
        }),
};

export default activeAxios;
