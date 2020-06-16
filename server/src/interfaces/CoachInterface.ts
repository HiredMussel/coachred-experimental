export interface CoachInterface {
    email: string,

    firstName: string,
    lastName: string,

    phone: string,
    dateOfBirth: string,

    postcode: string,
    location: Location,
    addressOne: string,
    addressTwo: string | null,

    qualifications: string,
    yearsCoaching: number | null,
    sport: string,
    expertise: string | null,

    // Security information will not always be returned
    token: string | null,
    salt: string | null,
    password: string | null,

    deleted: boolean,

    timeSlots: Array<any>
}