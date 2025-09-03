import React from "react";

const SupportInfo: React.FC = () => (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8 mx-auto max-w-xl">
        <h2 className="text-xl font-semibold mb-2">Support & Contact</h2>
        <p className="mb-1">For any queries or problems, please contact:</p>
        <ul className="list-disc ml-6">
            <li>
                Email:{" "}
                <a
                    href="mailto:cache2k25@gmail.com"
                    className="text-blue-600 underline"
                >
                    cache2k25@gmail.com
                </a>
            </li>
            <li>
                Phone:{" "}
                <a href="tel:+919999999999" className="text-blue-600 underline">
                    +91 9999999999
                </a>
            </li>
        </ul>
    </div>
);

export default SupportInfo;
