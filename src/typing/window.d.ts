export {};

// 定义window对象上的全局属性
declare global {
    interface Window {
        $dispatch: any;
        $store: any;
        $loadingTimer: any;
        $message: any;
    }
}
