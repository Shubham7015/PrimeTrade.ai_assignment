import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";
import {
    Trash2,
    Edit2,
    Plus,
    X,
    Search,
    Calendar,
    CheckCircle,
    Circle,
    Clock,
} from "lucide-react";

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        fetchTasks();
    }, [filter, search]);

    const fetchTasks = async () => {
        try {
            const params = {};
            if (filter) params.status = filter;
            if (search) params.search = search;

            const { data } = await api.get("/tasks", { params });
            setTasks(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (data) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, data);
                toast.success("Task updated successfully");
            } else {
                await api.post("/tasks", data);
                toast.success("New task created");
            }
            closeModal();
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter((t) => t._id !== id));
            toast.success("Task deleted");
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const openModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setValue("title", task.title);
            setValue("description", task.description);
            setValue("status", task.status);
            setValue("dueDate", task.dueDate ? task.dueDate.split("T")[0] : "");
        } else {
            setEditingTask(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        reset();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "in-progress":
                return <Clock className="w-4 h-4 text-blue-500" />;
            default:
                return <Circle className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-green-100 text-green-700 border-green-200",
            "in-progress": "bg-blue-50 text-brand-700 border-brand-200",
            pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        };
        return `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`;
    };

    return (
        <div className="mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        My Tasks
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Manage your work and boost productivity.
                    </p>
                </div>
                <Button
                    onClick={() => openModal()}
                    className="w-full sm:w-auto shadow-lg shadow-brand-500/20"
                >
                    <Plus className="w-5 h-5 mr-2" /> New Task
                </Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:text-sm transition-all"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-lg bg-gray-50"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <Plus className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new task.
                    </p>
                    <div className="mt-6">
                        <Button
                            onClick={() => openModal()}
                            className="w-auto mx-auto"
                            variant="secondary"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Create Task
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-100 transition-all duration-300 animate-slide-up"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={getStatusBadge(task.status)}>
                                    {getStatusIcon(task.status)}
                                    <span className="capitalize">{task.status}</span>
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(task)}
                                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-2 truncate pr-4">
                                {task.title}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                                {task.description || "No description provided."}
                            </p>

                            <div className="pt-4 border-t border-gray-50 flex items-center text-gray-400 text-xs">
                                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString(undefined, {
                                        dateStyle: "medium",
                                    })
                                    : "No due date"}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500/75 transition-opacity backdrop-blur-sm"
                            aria-hidden="true"
                            onClick={closeModal}
                        ></div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <div className="relative z-50 inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3
                                        className="text-xl font-bold text-gray-900"
                                        id="modal-title"
                                    >
                                        {editingTask ? "Edit Task" : "Create New Task"}
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit(handleCreateOrUpdate)}
                                    className="space-y-5"
                                >
                                    <Input
                                        label="Title"
                                        placeholder="e.g., Redesign homepage"
                                        {...register("title", { required: "Title is required" })}
                                        error={errors.title}
                                    />

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                            Description
                                        </label>
                                        <textarea
                                            {...register("description")}
                                            placeholder="Add some details..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:ring-brand-500/20 outline-none transition-all resize-none text-gray-900 bg-white placeholder-gray-500"
                                            rows="4"
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                                Status
                                            </label>
                                            <div className="relative">
                                                <select
                                                    {...register("status")}
                                                    className="appearance-none w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:ring-brand-500/20 outline-none transition-all bg-white"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <Input
                                            type="date"
                                            label="Due Date"
                                            {...register("dueDate")}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={closeModal}
                                            className="w-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="w-auto px-6">
                                            {editingTask ? "Save Changes" : "Create Task"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;
