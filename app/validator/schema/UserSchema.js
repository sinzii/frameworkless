const yup = require('yup');
const BaseSchema = require('./BaseSchema');

const passwordInputSchema = yup.string().max(20).required();
const passwordStrictSchema = yup.string().min(6).max(20).required();

const UserSchema = yup.object().shape(Object.assign({
    email: yup.string().email().required().max(100).meta({ unique: true }),
    verified: yup.boolean().default(false), // has email verified?
    name: yup.string().required().max(50),
    passwordHash: yup.string(),
    salt: yup.string(),
    suspended: yup.boolean().default(false)
}, BaseSchema));

const RegisterUserSchema = UserSchema.pick(['name', 'email']).shape({
    password: passwordStrictSchema,
    confirmPassword: passwordStrictSchema
});

const LoginSchema = UserSchema.pick(['email']).shape({
    password: passwordInputSchema,
});

const UpdateUserProfileSchema = UserSchema.pick(['id', 'email', 'name']);

const ChangePasswordSchema = UserSchema.pick(['id']).shape({
    password: passwordInputSchema,
    newPassword: passwordStrictSchema,
    confirmPassword: passwordInputSchema,
});

const SuspendAccountSchema = UserSchema.pick(['id']).shape({
    password: passwordInputSchema
});

const ForgetPasswordSchema = UserSchema.pick(['email']);

const ResetPasswordSchema = UserSchema.pick(['id']).shape({
    newPassword: passwordStrictSchema,
    confirmPassword: passwordInputSchema,
});

module.exports = {
    UserSchema,
    RegisterUserSchema,
    LoginSchema,
    UpdateUserProfileSchema,
    ChangePasswordSchema,
    SuspendAccountSchema,
    ForgetPasswordSchema,
    ResetPasswordSchema
}
