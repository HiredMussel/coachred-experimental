import validator from 'validator';
import { AthleteInterface } from '../interfaces/AthleteInterface';
import { SportModel} from '../models/SportModel';

export const validateAthlete = async (athlete: AthleteInterface): Promise<boolean> => {
    const sports = (await SportModel.find()).map((sport: any) => sport.name)

    const sportValid: boolean = (sports.includes(athlete.sport))
    const emailValid: boolean = validator.isEmail(athlete.email);
    const dateOfBirthValid: boolean = 
        (RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)).test(athlete.dateOfBirth);
    const phoneValid: boolean = 
        (RegExp(/^[0-9\+ ]+$/)).test(athlete.phone);

    return sportValid && emailValid && dateOfBirthValid && phoneValid
}