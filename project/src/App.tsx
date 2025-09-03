import React, { useState } from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import RegistrationForm from "./components/RegistrationForm";
import PaymentModal from "./components/PaymentModal";
import SuccessModal from "./components/SuccessModal";
import AdminPanel from "./components/AdminPanel";
import { Event, Registration } from "./types/Event";
import SupportInfo from "./components/SupportInfo";
import CollegeInfo from "./components/CollegeInfo";

type AppState = "events" | "registration" | "payment" | "success" | "admin";

function App() {
    const [currentState, setCurrentState] = useState<AppState>("events");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [registration, setRegistration] = useState<Registration | null>(null);

    const handleEventSelect = (event: Event) => {
        setSelectedEvent(event);
        setCurrentState("registration");
    };

    const handleRegistrationSubmit = (registrationData: Registration) => {
        setRegistration(registrationData);
        setCurrentState("payment");
    };

    const handlePaymentSuccess = () => {
        setCurrentState("success");
    };

    const handleBackToEvents = () => {
        setCurrentState("events");
        setSelectedEvent(null);
        setRegistration(null);
    };

    const handleCloseModal = () => {
        if (currentState === "success") {
            handleBackToEvents();
        } else {
            setCurrentState("registration");
        }
    };

    const handleAdminAccess = () => {
        setCurrentState("admin");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {currentState !== "admin" && <Header />}
            <main className="flex-1 flex flex-col items-center px-2 sm:px-6 lg:px-8 w-full">
                <div className="mt-8 w-full flex flex-col items-center">
                    <CollegeInfo />
                </div>
                {currentState === "events" && (
                    <EventList onEventSelect={handleEventSelect} />
                )}
                {currentState === "registration" && selectedEvent && (
                    <RegistrationForm
                        event={selectedEvent}
                        onBack={handleBackToEvents}
                        onSubmit={handleRegistrationSubmit}
                    />
                )}
                {currentState === "payment" && registration && (
                    <PaymentModal
                        registration={registration}
                        onClose={handleCloseModal}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
                {currentState === "success" && (
                    <SuccessModal onClose={handleCloseModal} />
                )}
                {currentState === "admin" && (
                    <div className="w-full flex flex-col items-center">
                        <AdminPanel />
                        <button
                            onClick={handleBackToEvents}
                            className="fixed top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Events
                        </button>
                    </div>
                )}
                <div className="mt-8 w-full flex flex-col items-center">
                    <SupportInfo />
                </div>
            </main>
            {/* Admin Access Button */}
            {currentState === "events" && (
                <div className="fixed bottom-4 right-4 z-40">
                    <button
                        onClick={handleAdminAccess}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition-colors"
                    >
                        Admin Panel
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
