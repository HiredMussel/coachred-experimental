import mongoose = require('mongoose');

const sportProperties = {
    name: {type: String, required: true, index:{unique: true}}
};

const sportSchema: mongoose.Schema = new mongoose.Schema(sportProperties, {collection: 'sport'});
export const SportModel: mongoose.Model<mongoose.Document, {}> = mongoose.model('Sport', sportSchema);