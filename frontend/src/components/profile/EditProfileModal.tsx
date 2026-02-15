import type { MyUser } from '../../types/user';
import { useState, type SubmitEvent } from 'react';

type Props = {
    user: MyUser;
    onClose: () => void;
    onSave: (user: MyUser) => void;
};

type FormErrors = Partial<Record<keyof MyUser, string>>;

const validateForm = (data: MyUser): FormErrors => {
    const errors: FormErrors = {};

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

const ErrorText = ({ message }: { message?: string }) =>
    message ? <p className="text-red-500 text-xs mb-2">{message}</p> : null;

const EditProfileModal = ({ user, onClose, onSave }: Props) => {
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
                        className="text-gray-500 hover:text-accent text-xl"
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col"
                >
                    <label className="text-sm font-medium">First Name</label>
                    <input
                        className={`border p-2 rounded mb-1 ${
                            errors.firstName ? 'border-red-500' : ''
                        }`}
                        value={formData.firstName}
                        onChange={(e) =>
                            handleChange('firstName', e.target.value)
                        }
                        placeholder="First name"
                    />
                    <ErrorText message={errors.firstName} />

                    <label className="text-sm font-medium">Last Name</label>
                    <input
                        className={`border p-2 rounded mb-1 ${
                            errors.lastName ? 'border-red-500' : ''
                        }`}
                        value={formData.lastName}
                        onChange={(e) =>
                            handleChange('lastName', e.target.value)
                        }
                        placeholder="Last name"
                    />
                    <ErrorText message={errors.lastName} />

                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className={`border p-2 rounded mb-1 ${
                            errors.email ? 'border-red-500' : ''
                        }`}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Email"
                    />
                    <ErrorText message={errors.email} />

                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                        className={`border p-2 rounded mb-1 ${
                            errors.phoneNumber ? 'border-red-500' : ''
                        }`}
                        value={formData.phoneNumber}
                        onChange={(e) =>
                            handleChange('phoneNumber', e.target.value)
                        }
                        placeholder="Phone number"
                    />
                    <ErrorText message={errors.phoneNumber} />

                    <button
                        type="submit"
                        className="bg-dark-gray text-white p-2 mt-1 rounded hover:bg-accent"
                    >
                        Save changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
