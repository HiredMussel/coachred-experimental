export interface AthleteInterface {
    email: string,

    firstName: string,
    lastName: string,

    phone: string,
    dateOfBirth: string,

    yearsExperience: number | null,
    sport: string,
    lookingFor: string,

    // Security information should always exist, but will not always be accessible
    token: string | null,
    salt: string | null,
    password: string | null,

    deleted: boolean
}