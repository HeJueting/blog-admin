// 展示loading
export const showLoading = () => {
    // 如果当前loading已经为true，不需要再次展示loading
    if (!window.$store.loading) {
        window.$dispatch({
            type: 'SET_LOADING',
            params: {
                loading: true,
            },
        });
    }
};

// 隐藏loading
export const hiddenLoading = () => {
    // 如果已经有loading消失程序
    if (window.$loadingTimer) {
        clearTimeout(window.$loadingTimer);
        window.$loadingTimer = null;
    }
    // 重新定义一个200ms延时的timer
    window.$loadingTimer = setTimeout(() => {
        window.$dispatch({
            type: 'SET_LOADING',
            params: {
                loading: false,
            },
        });
    }, 200);
};

// 时间格式转换: 0(YYYY-MM-DD)、1(YYYY-MM-DD mm:ss)
export function timeFormat(stamp: number | string, format: number) {
    const date = new Date(stamp);
    const year = date.getFullYear();

    const monthNum = date.getMonth() + 1;
    const month = monthNum < 10 ? `0${monthNum}` : monthNum;

    const dayNum = date.getDate();
    const day = dayNum < 10 ? `0${dayNum}` : dayNum;

    const hourNum = date.getHours();
    const hour = hourNum < 10 ? `0${hourNum}` : hourNum;

    const minuteNum = date.getMinutes();
    const minute = minuteNum < 10 ? `0${minuteNum}` : minuteNum;

    if (format === 1) {
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

    return `${year}-${month}-${day}`;
}
