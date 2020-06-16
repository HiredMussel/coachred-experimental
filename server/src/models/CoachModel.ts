import mongoose = require('mongoose');

const coachProperties = {
    // Coaches are uniquely defined by their email address, which is the username they use for login
    email: {type: String, required: true, index: {unique: true}},
    
    // Personal data
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},

    phone: {type: String, required: true},
    dateOfBirth: {type: String, required: true},

    postcode: {type: String, required: true},
    location: {
        latitude: {type: String, required: true},
        longitude: {type: String, required: true}
    },
    addressOne: {type: String, required: true},
    addressTwo: String,

    // Information about this user as a sports coach
    qualifications: {type: String, required: true},
    yearsCoaching: Number,
    sport: {type: String, required: true},
    expertise: String,


    // Password and security data
    token: {type: String, required: true, select: false},
    salt: {type: String, required: true, select: false},
    password: {type: String, required: true, select: false},

    deleted: {type: Boolean, required: true},

    // Data about available time slots
    timeSlots: [
        {
            ageRange: {type: String, required: true},
            hourlyRate: {type: Number, required: true},
            date: {type: Date, required: true},
            startTime: {type: String, required: true},
            endTime: {type: String, required: true},
            repeat: {type: String, required: true},
            bookedBy: [{
                firstName: {type: String, required: true},
                lastName: {type: String, required: true},
                startDate: {type: Date, required: true},
                endDate: {type: Date, required: true},
                email: {type: String, required: true},
                phone: {type: String, required: true}
            }]
        }
    ]
}

const coachSchema : mongoose.Schema = new mongoose.Schema(coachProperties, {collection: 'coach'});
export const CoachModel: mongoose.Model<mongoose.Document, {}> = mongoose.model('Coach', coachSchema);