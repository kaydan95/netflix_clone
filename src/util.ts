export function makeImage(id:string, size?:string){
    return `https://image.tmdb.org/t/p/${size ? size : "original"}/${id}`;
}

export function makeClip(key:string){
    return `https://www.cors-anywhere.herokuapp.com/https://www.youtube.com/watch?v=${key}`;
}

//https://www.cors-anywhere.herokuapp.com/