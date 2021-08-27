export type direction = {
    offset: number,
    x: number,
    y: number,
    opposite: string
}

export type directionSet = {
    [name: string]: direction
}
