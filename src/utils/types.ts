export type JwtPayload = {
    id: number,
    role: "admin" | "superAdmin",
    userName: string
}
