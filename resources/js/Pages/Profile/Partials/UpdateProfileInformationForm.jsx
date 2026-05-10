import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {

    const user = usePage().props.auth.user;

    const {
        data,
        setData,
        post,
        errors,
        processing,
        recentlySuccessful
    } = useForm({
        name: user.name,
        email: user.email,
        city: user.city || '',
        phone: user.phone || '',
        profile_picture: null,
    });

    const submit = (e) => {

        e.preventDefault();
    
        router.post(route('profile.update'), {
    
            _method: 'patch',
    
            name: data.name,
    
            email: data.email,
    
            city: data.city,
    
            phone: data.phone,
    
            profile_picture: data.profile_picture,
    
        }, {
    
            forceFormData: true,
    
            preserveScroll: true,
        });
    };
    return (

        <section className={className}>

            <header>

                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>

            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">

                {/* Name */}

                <div>

                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError
                        className="mt-2"
                        message={errors.name}
                    />

                </div>

                {/* Email */}

                <div>

                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError
                        className="mt-2"
                        message={errors.email}
                    />

                </div>

                {/* City */}

                <div>

                    <InputLabel htmlFor="city" value="City" />

                    <TextInput
                        id="city"
                        className="mt-1 block w-full"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                    />

                    <InputError
                        className="mt-2"
                        message={errors.city}
                    />

                </div>

                {/* Phone */}

                <div>

                    <InputLabel htmlFor="phone" value="Phone" />

                    <TextInput
                        id="phone"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />

                    <InputError
                        className="mt-2"
                        message={errors.phone}
                    />

                </div>

             {/* Profile Picture */}

<div>

<InputLabel
    htmlFor="profile_picture"
    value="Profile Picture"
/>

{user.profile_picture && (

    <img
        src={`/storage/${user.profile_picture}`}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover mb-4"
    />

)}

<input
    type="file"
    className="mt-1 block w-full"
    onChange={(e) =>
        setData(
            'profile_picture',
            e.target.files[0]
        )
    }
/>

<InputError
    className="mt-2"
    message={errors.profile_picture}
/>

</div>

                {/* Email Verification */}

                {mustVerifyEmail && user.email_verified_at === null && (

                    <div>

                        <p className="mt-2 text-sm text-gray-800">

                            Your email address is unverified.

                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>

                        </p>

                        {status === 'verification-link-sent' && (

                            <div className="mt-2 text-sm font-medium text-green-600">

                                A new verification link has been sent to your
                                email address.

                            </div>

                        )}

                    </div>

                )}

                {/* Save Button */}

                <div className="flex items-center gap-4">

                    <PrimaryButton disabled={processing}>
                        Save
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >

                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>

                    </Transition>

                </div>

            </form>

        </section>
    );
}