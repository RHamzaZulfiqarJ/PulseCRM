import { Schema, model } from 'mongoose'
import { generateUniqueIdentifier } from '../utils/utils.js'

const leadSchema = Schema({
    client: { type: Schema.Types.ObjectId, ref: 'User', required: false, },
    property: { type: Schema.Types.ObjectId, ref: 'Project', required: false },
    area: { type: String, required: false },
    city: { type: String, required: false },
    priority: { type: String, required: false, default: 'moderate' },
    status: { type: String, required: false },
    clientName: { type: String, required: false },
    clientPhone: { type: String, required: false},
    client: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    source: { type: String, required: false },
    description: { type: String, required: false },
    allocatedTo: { type: [Schema.Types.ObjectId], ref: 'User' },
    images: { type: [String], required: false, default: [] },
    isArchived: { type: Boolean, required: false, default: false },
    followUps: { type: [Schema.Types.ObjectId], ref: 'FollowUp', default: [] },
    isAppliedForRefund: { type: Boolean, default: false },
    uid: { type: String, },
}, { timestamps: true })


// Before saving a new document, generate a unique readable identifier
leadSchema.pre('save', async function (next) {
    if (!this.uid) {
        let isUnique = false;
        let generatedIdentifier;

        while (!isUnique) {
            // Generate a unique identifier (you can use a library for this)
            generatedIdentifier = generateUniqueIdentifier();

            // Check if it's unique in the collection
            const existingDocument = await this.constructor.findOne({ uid: generatedIdentifier });

            if (!existingDocument) {
                isUnique = true; // Identifier is unique, exit the loop
            }
        }

        // Assign the generated identifier to the document
        this.uid = generatedIdentifier;
    }
    next();
});


const leadModel = model('Lead', leadSchema)
export default leadModel