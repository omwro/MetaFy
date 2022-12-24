// This class is meant to cast the spotify class to our own to reduce data size
import {DYNAMIC} from "/src/store/store";
import {getSubTagsFromDependencyString, splitDependencyString} from "/src/utilities/Dependency";

const CATEGORY_REGEX = /\[.*?\]/g;

export class Playlist {
    constructor(spotifyPlaylist) {
        this.id = spotifyPlaylist.id
        this.uri = spotifyPlaylist.uri
        if (spotifyPlaylist["external_urls"]) this.externalUrl = spotifyPlaylist["external_urls"]["spotify"]
        if (!spotifyPlaylist["external_urls"]) this.externalUrl = spotifyPlaylist.external_urls
        this.name = spotifyPlaylist.name
        this.description = spotifyPlaylist.description
        this.category = undefined
        this.tag = spotifyPlaylist.name
        this.subtags = []
        this.dependency = []
        this.songs = []
        this.songsCount = spotifyPlaylist.tracks ? spotifyPlaylist.tracks.total : 0
        this.img = spotifyPlaylist.images.length ? spotifyPlaylist.images.at(0).url : null

        this.convert()
    }

    getTagFromName() {
        const category = this.name.match(CATEGORY_REGEX)[0].slice(1, -1).trim();
        const tag = this.name.substring(this.name.match(CATEGORY_REGEX)[0].length).trim()
        return {category, tag};
    }

    convert() {
        // Update properties in case it has a category
        if (this.name.match(CATEGORY_REGEX)) {
            const masterTag = this.getTagFromName();
            this.category = masterTag.category;
            this.tag = masterTag.tag;
            if (this.category === DYNAMIC) {
                this.dependency = splitDependencyString(this.description)
                this.subtags = getSubTagsFromDependencyString(this.description)
            }
        }
    }

    static isInstance(obj) {
        return obj instanceof Playlist || obj instanceof Object
    }
}