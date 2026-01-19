export function applyDefaultToJSON(schema) {
    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
        }
    });
}