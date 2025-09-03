import React from "react";

const CollegeInfo: React.FC = () => (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4 mx-auto w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">College Information</h2>
        <p className="mb-2 text-lg">
            Location: V.S.M. College of Engineerng, Main road, Ramachandrapuram
        </p>
        <img
            src="https://content.jdmagicbox.com/v2/comp/east_godavari/g5/9999px883.x883.220613012313.s5g5/catalogue/v-s-m-degree-and-p-g-colleges-ramachandrapuram-east-godavari-colleges-popi7edqyk.jpg"
            alt="College Campus"
            className="rounded-lg w-full max-w-3xl mb-2"
        />
    </div>
);

export default CollegeInfo;
