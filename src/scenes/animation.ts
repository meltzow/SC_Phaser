export type animation = {
    startFrame: number,
    endFrame: number,
    speed: number
}
export type animationSet = {
    [name: string]: animation
}
