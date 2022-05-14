export const state = () => ({
    snackbar: {
        status: false,
        message: '',
        color: ''
    }
})

export const getters = {
    getSnackbar: (state) => {
        return state.snackbar
    }
}
export const mutations = {
    SET_SNACKBAR(state, payload) {
        state.snackbar.status = payload.status
        state.snackbar.color = payload.color
        state.snackbar.message = payload.message
    }
}

export const actions = {
    snackbar: ({ commit }, payload) => {
        commit('SET_SNACKBAR', payload)
        setTimeout(() => {
            commit('SET_SNACKBAR', {
                status: false,
                color: '',
                message: ''
            })
        }, 3000);
    }
}