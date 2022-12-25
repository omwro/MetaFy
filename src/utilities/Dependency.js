import store from "/src/store/store";
import {addSongs, equalizeSongs, removeSongs} from "/src/utilities/Combination";

export const OPERATOR_REGEX = /[+|\-|=]+/g
export const COMBINATION_REGEX = /([[:alnum:]]+|[+|\-|=]+)/g

// Split the dependency string from "dwadwa+vrfrrdgdr" to a combined list like [Playlist, "+", Playlist]
export function splitDependencyString(string) {
    return string.split(COMBINATION_REGEX)
        // .map((char) => {
        //     if (!char.match(OPERATOR_REGEX)) {
        //         const foundPlaylist = Object.values(store.state.playlists).find((pl) => pl.id === char)
        //         return foundPlaylist ? new Playlist(foundPlaylist) : null
        //     }
        //     return char
        // })
        // .filter((char) => char !== null)
}

// Make a string from the dependency list
export function getDependencyStringFromList(dependencyList) {
    let string = ""
    dependencyList.forEach((dep) => {
        if (store.state.playlists[dep]) string += store.state.playlists[dep].id
        else string += dep
    })
    return string
}

export function getDependencyNamesFromList(dependencyList) {
    let string = ""
    dependencyList.forEach((dep) => {
        if (store.state.playlists[dep]) string += store.state.playlists[dep].name
        else string += dep
        string += " "
    })
    return string
}

// Split the dependency string from "dwadwa+vrfrrdgdr" to subtags like [Playlist, Playlist]
export function getSubTagsFromDependencyString(string) {
    return string.split(OPERATOR_REGEX)
        // .map((id) => {
        //     const foundPlaylist = Object.values(store.state.playlists).find((pl) => pl.id === id)
        //     return foundPlaylist ? new Playlist(foundPlaylist) : null
        // })
        // .filter((id) => id !== null)
}

// Get songs based on the dependency list
export function getSongsFromDependencyList(dependencyList) {
    let songs = []
    let operator = null
    dependencyList.forEach((dep) => {
        if (store.state.playlists[dep]) {
            const dependencySongs = store.state.playlists[dep].songs.map(songId => store.state.songs[songId])
            switch (operator){
                case null:
                case "+":
                    songs = addSongs(songs, dependencySongs)
                    break
                case "-":
                    songs = removeSongs(songs, dependencySongs)
                    break
                case "=":
                    songs = equalizeSongs(songs, dependencySongs)
                    break
            }
        } else {
            operator = dep
        }
    })
    return songs
}
