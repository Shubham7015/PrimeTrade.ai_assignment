import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { signup } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const success = await signup(data.name, data.email, data.password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url("https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")] bg-cover bg-center'>
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

            <div className='max-w-md w-full space-y-8 glass-card p-10 rounded-2xl relative z-10 animate-fade-in'>
                <div className='text-center'>
                    <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
                        Create an account
                    </h2>
                    <p className='mt-2 text-sm text-gray-600'>
                        Already have an account?{' '}
                        <Link to='/login' className='font-semibold text-brand-600 hover:text-brand-500 transition-colors'>
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-4'>
                        <Input
                            label='Full Name'
                            placeholder='John Doe'
                            {...register('name', { required: 'Name is required' })}
                            error={errors.name}
                        />

                        <Input
                            label='Email address'
                            type='email'
                            placeholder='you@example.com'
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={errors.email}
                        />

                        <Input
                            label='Password'
                            type='password'
                            placeholder='••••••••'
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            error={errors.password}
                        />
                    </div>

                    <div>
                        <Button type='submit' isLoading={isSubmitting} className="h-12 text-base">
                            Sign up
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
