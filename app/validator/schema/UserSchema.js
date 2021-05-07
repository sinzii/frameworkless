const yup = require('yup');
const BaseSchema = require('./BaseSchema');

const UserSchema = yup.object().shape(Object.assign({
    email: yup.string().email().required().max(100).meta({ unique: true }),
    verified: yup.boolean().default(false), // has email verified?
    name: yup.string().required().max(50),
    passwordHash: yup.string(),
    salt: yup.string()
}, BaseSchema));

const RegisterUserSchema = UserSchema.pick(['name', 'email']).shape({
    password: yup.string().min(6).max(20).required(),
    confirmPassword: yup.string().min(6).max(20).required()
});

const LoginSchema = UserSchema.pick(['email']).shape({
    password: yup.string().required().max(20),
});

const UpdateUserProfileSchema = UserSchema.pick(['id', 'email', 'name']);

const ChangePasswordSchema = UserSchema.pick(['id']).shape({
    password: yup.string().max(20).required(),
    newPassword: yup.string().min(6).max(20).required(),
    confirmPassword: yup.string().max(20).required(),
});

module.exports = {
    UserSchema,
    RegisterUserSchema,
    LoginSchema,
    UpdateUserProfileSchema,
    ChangePasswordSchema
}
