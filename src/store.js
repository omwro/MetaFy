import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import moment from "moment";

Vue.use(Vuex)

export const DYNAMIC = "Dynamic"

const getDefaultState = () => {
    return {
        codeVerifier: null,
        codeChallenge: null,
        authorizationCode: null,
        authorizationState: null,
        accessToken: null,
        refreshToken: null,
        refreshedOn: null,
        expiresIn: moment(),
        user: null,
        playlists: [],
        songs: [],
        loading: false,
        editorMode: false,
        confirmAction: null,
        songAction: null,
    }
}

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: getDefaultState,
    mutations: {
        codeVerifier(state, value) {
            state.codeVerifier = value;
        },
        codeChallenge(state, value) {
            state.codeChallenge = value;
        },
        authorizationCode(state, value) {
            state.authorizationCode = value;
        },
        authorizationState(state, value) {
            state.authorizationState = value;
        },
        accessToken(state, value) {
            state.accessToken = value;
        },
        refreshToken(state, value) {
            state.refreshToken = value;
        },
        refreshedOn(state, value) {
            state.refreshedOn = value;
        },
        expiresIn(state, value) {
            state.expiresIn = value;
        },
        user(state, value) {
            state.user = value;
        },
        playlists(state, value) {
            state.playlists = value;
        },
        songs(state, value) {
            state.songs = value;
        },
        loading(state, value) {
            state.loading = value;
        },
        resetState(state) {
            Object.assign(state, getDefaultState())
        },
        editorMode(state, value) {
            state.editorMode = value;
        },
        confirmAction(state, value) {
            state.confirmAction = value;
        },
        songAction(state, value) {
            state.songAction = value;
        },
    },
    getters: {
        isLoggedIn: state => () => {
            return state.accessToken != null;
        },
        getDynamicPlaylists: state => () => {
            return Object.values(state.playlists).filter(pl => pl.category === DYNAMIC)
        },
        getTaggedPlaylists: state => () => {
            const taggedList = []
            Object.values(state.playlists)
                .filter(pl => pl.category !== DYNAMIC && pl.category !== undefined)
                .forEach((pl) => {
                    if (!taggedList.filter((tl) => tl.category === pl.category).length) {
                        taggedList.push({
                            category: pl.category,
                            playlists: []
                        })
                    }
                    taggedList.filter((tl) => tl.category === pl.category)[0]
                        .playlists
                        .push(pl)
                })
            return taggedList
        },
        getUntaggedPlaylists: state => () => {
            return Object.values(state.playlists).filter(pl => pl.category === undefined)
        },
    },
    actions: {
        removeSongTag(state, value) {
            const songId = value[0]
            const playlistId = value[1]

            let newSongs = state.state.songs
            let newPlaylists = state.state.playlists

            newSongs[songId].playlists = newSongs[songId].playlists.filter(playlist => playlist !== playlistId)
            newPlaylists[playlistId].songs = newPlaylists[playlistId].songs.filter(song => song !== songId)

            state.commit("songs", newSongs)
            state.commit("playlists", newPlaylists)
        },
        addSongTag(state, value) {
            const songId = value[0]
            const playlistId = value[1]

            let newSongs = state.state.songs
            let newPlaylists = state.state.playlists

            newSongs[songId].playlists.push(playlistId)
            newPlaylists[playlistId].songs.push(songId)

            state.commit("songs", newSongs)
            state.commit("playlists", newPlaylists)
        }
    },
    modules: {}
})
