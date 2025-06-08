import DangerButton from '@/Components/Primitive/DangerButton';
import InputError from '@/Components/Primitive/InputError';
import InputLabel from '@/Components/Primitive/InputLabel';
import Modal from '@/Components/Primitive/Modal';
import SecondaryButton from '@/Components/Primitive/SecondaryButton';
import TextInput from '@/Components/Primitive/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const requestAccountDeletion = (e) => {
        e.preventDefault();

        post(route('profile.request-deletion'), {
            password: data.password,
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 5000);
            },
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Request Account Deletion
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Once your account deletion request is approved by an administrator,
                    all of its resources and data will be permanently deleted. Before
                    requesting deletion, please download any data or information that
                    you wish to retain.
                </p>
            </header>

            {showSuccessMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
                    Your account deletion request has been submitted. An administrator will review your request.
                </div>
            )}

            <DangerButton onClick={confirmUserDeletion}>
                Request Account Deletion
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={requestAccountDeletion} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to request account deletion?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Your account deletion request will be reviewed by an administrator.
                        Once approved, all of your account's resources and data will be
                        permanently deleted. Please enter your password to confirm your
                        deletion request.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Request Deletion
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
