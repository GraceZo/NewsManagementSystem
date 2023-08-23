export const UserReducer = (prevState = {
    isUpdateDisabled: true
}, action) => {
    //console.log(action)
    let { type } = action
    switch (type) {
        case "change_isUpdateDisabled":
            let newstate = {...prevState}
            newstate.isUpdateDisabled = !newstate.isUpdateDisabled
            return newstate
        default:
            return prevState
    }
}