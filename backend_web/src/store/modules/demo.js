const state = {
    testData:[]
}

const mutations = {
    setDate: (state, data) => {
        state.testData = data
    }
}

const actions = {
    setDateAction: ({commit}, data) => {
        commit('setDate',data)
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}