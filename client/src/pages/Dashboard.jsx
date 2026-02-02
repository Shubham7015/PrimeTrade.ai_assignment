import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import TaskManager from '../components/TaskManager';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className='min-h-screen bg-gray-50'>
            <header className='bg-white border-b border-gray-200 sticky top-0 z-20'>
                <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/30">
                            A
                        </div>
                        <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Dashboard</h1>
                    </div>

                    <div className='flex items-center gap-6'>
                        <div className='text-right hidden sm:block'>
                            <p className='text-sm font-semibold text-gray-900'>{user?.name}</p>
                            <p className='text-xs text-gray-500'>{user?.email}</p>
                        </div>
                        <Button onClick={logout} variant='ghost' className='w-auto text-gray-600 hover:text-red-600 hover:bg-red-50'>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>
            <main className="animate-fade-in">
                <div className='max-w-7xl mx-auto py-8 sm:px-6 lg:px-8'>
                    <TaskManager />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
