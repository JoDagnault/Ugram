import type { MyUser } from '../types/user';
import { useState } from 'react';

type Props = {
    user: MyUser;
    onClose: () => void;
    onSave: (user: MyUser) => void;
};

const EditProfileModal = ({ user, onClose, onSave }: Props) => {
    const [formData, setFormData] = useState<MyUser>(user);
    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <div className="fixed inset-0 w-screen h-screen bg-white dark:bg-dark flex justify-center items-center z-50">
            <div className="w-[90%] max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Profile</h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-accent"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                        placeholder="First name"
                        className="border p-1 mb-3 rounded"
                        value={formData.firstName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                firstName: e.target.value,
                            })
                        }
                    />

                    <label className="text-sm font-medium">Last Name</label>
                    <input
                        placeholder="Last name"
                        className="border p-1 mb-3 rounded"
                        value={formData.lastName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lastName: e.target.value,
                            })
                        }
                    />

                    <label className="text-sm font-medium">Email</label>
                    <input
                        placeholder="Email"
                        className="border p-1 mb-3 rounded"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />

                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                        placeholder="Phone"
                        className="border p-1 mb-3 rounded"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                    />

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
