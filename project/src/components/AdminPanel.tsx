import React, { useState, useEffect } from "react";
import {
    Download,
    Users,
    Calendar,
    Search,
    Filter,
    RefreshCw,
} from "lucide-react";

interface RegistrationData {
    registrationId: string;
    eventId: string;
    eventName: string;
    participantName: string;
    email: string;
    phone: string;
    college: string;
    totalAmount: number;
    paymentStatus: string;
    paymentId: string;
    registrationDate: string;
    teamMembers?: any[];
    gameIds?: any[];
}

const TEST_EMAIL = "admin@vsmcoe.com";
const TEST_PASSWORD = "vsmcoe2025";

const AdminPanel: React.FC = () => {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEvent, setFilterEvent] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        technical: 0,
        nonTechnical: 0,
        totalRevenue: 0,
    });

    // Auth state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === TEST_EMAIL && password === TEST_PASSWORD) {
            setAuthenticated(true);
            setLoginError("");
        } else {
            setLoginError("Invalid email or password");
        }
    };

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/registrations");
            if (response.ok) {
                const data = await response.json();
                setRegistrations(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error("Error fetching registrations:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data: RegistrationData[]) => {
        const technicalEvents = [
            "web-dev",
            "poster-presentation",
            "techexpo",
            "pycharm",
            "technical-quiz",
        ];
        const technical = data.filter((reg) =>
            technicalEvents.includes(reg.eventId)
        ).length;
        const nonTechnical = data.length - technical;
        const totalRevenue = data.reduce(
            (sum, reg) => sum + reg.totalAmount,
            0
        );

        setStats({
            total: data.length,
            technical,
            nonTechnical,
            totalRevenue,
        });
    };

    const downloadExcel = async () => {
        try {
            const response = await fetch("/api/download-excel");
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "cache2k25_registrations.xlsx";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error("Error downloading Excel:", error);
            alert("Failed to download Excel file");
        }
    };

    const filteredRegistrations = registrations.filter((reg) => {
        const matchesSearch =
            reg.participantName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.registrationId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterEvent === "all" || reg.eventId === filterEvent;

        return matchesSearch && matchesFilter;
    });

    useEffect(() => {
        if (authenticated) {
            fetchRegistrations();
        }
    }, [authenticated]);

    const eventOptions = [
        { value: "all", label: "All Events" },
        { value: "web-dev", label: "Web Development" },
        { value: "poster-presentation", label: "Poster Presentation" },
        { value: "techexpo", label: "Tech Expo" },
        { value: "pycharm", label: "PyCharm Contest" },
        { value: "technical-quiz", label: "Technical Quiz" },
        { value: "photo-contest", label: "Photography Contest" },
        { value: "tech-meme-contest", label: "Tech Meme Contest" },
        { value: "bgmi-esports", label: "BGMI Esports" },
        { value: "freefire-esports", label: "Free Fire Esports" },
    ];

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <form
                    onSubmit={handleLogin}
                    className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
                >
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Admin Login
                    </h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {loginError && (
                        <div className="mb-4 text-red-600 text-sm">
                            {loginError}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Cache2K25 Admin Panel
                            </h1>
                            <p className="text-gray-600">
                                Manage event registrations and view analytics
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={fetchRegistrations}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh</span>
                            </button>
                            <button
                                onClick={downloadExcel}
                                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download Excel</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <Users className="w-8 h-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Registrations
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Technical Events
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.technical}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <Users className="w-8 h-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Non-Technical Events
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.nonTechnical}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <Download className="w-8 h-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Revenue
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{stats.totalRevenue}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or registration ID..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="md:w-64">
                            <div className="relative">
                                <Filter className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                                <select
                                    value={filterEvent}
                                    onChange={(e) =>
                                        setFilterEvent(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                >
                                    {eventOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registrations Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Registrations ({filteredRegistrations.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">
                                Loading registrations...
                            </span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registration ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Participant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRegistrations.map(
                                        (registration) => (
                                            <tr
                                                key={
                                                    registration.registrationId
                                                }
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                    {
                                                        registration.registrationId
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {
                                                                registration.participantName
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                registration.college
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {registration.eventName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {registration.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {registration.phone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                    ₹{registration.totalAmount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        {
                                                            registration.paymentStatus
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(
                                                        registration.registrationDate
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>

                            {filteredRegistrations.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        No registrations found
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
