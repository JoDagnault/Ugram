import type { MyUser } from '../../types/user';
import { useState, type SubmitEvent } from 'react';
import { deleteMe } from '../../api/users/usersService.ts';

type Props = {
    user: MyUser;
    onClose: () => void;
    onSave: (user: MyUser) => void;
    onDelete: () => void;
    error?: string | null;
};

type FormErrors = Partial<Record<keyof MyUser, string>>;

const validateForm = (data: MyUser): FormErrors => {
    const errors: FormErrors = {};

    if (!data.username.trim()) {
        errors.username = 'Username is required';
    } else if (data.username.length > 30) {
        errors.username = 'Maximum 30 characters';
    } else if (!/^[\p{L}\p{N} _-]+$/u.test(data.username)) {
        errors.username =
            'Only letters, numbers, spaces, underscores and hyphens are allowed';
    }

    if (!data.firstName.trim()) {
        errors.firstName = 'First name is required';
    } else if (data.firstName.length > 250) {
        errors.firstName = 'Maximum 250 characters';
    } else if (!/^[\p{L} -]+$/u.test(data.firstName)) {
        errors.firstName = 'Only letters, spaces and hyphens are allowed';
    }

    if (!data.lastName.trim()) {
        errors.lastName = 'Last name is required';
    } else if (data.lastName.length > 250) {
        errors.lastName = 'Maximum 250 characters';
    } else if (!/^[\p{L} -]+$/u.test(data.lastName)) {
        errors.lastName = 'Only letters, spaces and hyphens are allowed';
    }

    if (!data.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    if (!data.phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(data.phoneNumber)) {
        errors.phoneNumber = 'Format must be xxx-xxx-xxxx with only numbers';
    }

    return errors;
};

interface FieldProps {
    label: string;
    field: keyof MyUser;
    placeholder: string;
    type?: string;
    error?: string;
    formData: MyUser;
    handleChange: (field: keyof MyUser, value: string) => void;
}

const EditField = ({
    label,
    field,
    placeholder,
    type = 'text',
    error,
    formData,
    handleChange,
}: FieldProps) => (
    <div className="flex flex-col">
        <label className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            {label}
        </label>
        <input
            type={type}
            className={`border p-2 rounded mb-1 ${error ? 'border-red-500' : ''}`}
            value={formData[field] as string}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
        />
        <ErrorText message={error} />
    </div>
);

const ErrorText = ({ message }: { message?: string }) =>
    message ? <p className="text-red-500 text-xs mb-2">{message}</p> : null;

const EditProfileModal = ({
    user,
    onClose,
    onSave,
    onDelete,
    error,
}: Props) => {
    const [formData, setFormData] = useState<MyUser>(user);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        onSave(formData);
    };

    const handleChange = (field: keyof MyUser, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-white dark:bg-dark flex justify-center items-center z-50">
            <div className="w-[90%] max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition text-lg leading-none"
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col"
                >
                    <EditField
                        label="Username"
                        field="username"
                        placeholder="Username"
                        error={errors.username}
                        formData={formData}
                        handleChange={handleChange}
                    />
                    <EditField
                        label="First Name"
                        field="firstName"
                        placeholder="First name"
                        error={errors.firstName}
                        formData={formData}
                        handleChange={handleChange}
                    />
                    <EditField
                        label="Last Name"
                        field="lastName"
                        placeholder="Last name"
                        error={errors.lastName}
                        formData={formData}
                        handleChange={handleChange}
                    />
                    <EditField
                        label="Email"
                        field="email"
                        placeholder="Email"
                        type="email"
                        error={errors.email}
                        formData={formData}
                        handleChange={handleChange}
                    />
                    <EditField
                        label="Phone Number"
                        field="phoneNumber"
                        placeholder="Phone number"
                        error={errors.phoneNumber}
                        formData={formData}
                        handleChange={handleChange}
                    />

                    {error && (
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="mt-3 px-3 py-2 rounded-full border border-gray-500 bg-dark-gray hover:bg-accent/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    >
                        Save changes
                    </button>
                    <button
                        type="button"
                        onClick={async () => {
                            if (
                                confirm(
                                    'Are you sure you want to delete your account?',
                                )
                            ) {
                                await deleteMe();
                                onDelete();
                            }
                        }}
                        className="mt-3 px-3 py-2 rounded-full border text-red-500 border-gray-500 bg-dark-gray hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                    >
                        Delete account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
