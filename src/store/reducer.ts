// 接口：state
interface IState {
    loading: boolean;
}
// 接口：action
interface IAction {
    type: string;
    params?: any;
}

const reducer = (state: IState, action: IAction) => {
    switch (action.type) {
        case 'SET_LOADING':
            state.loading = action.params.loading;
            return Object.assign({}, state);
        default:
            throw new Error();
    }
};

export default reducer;
