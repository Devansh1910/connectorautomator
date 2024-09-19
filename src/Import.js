import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { collection, addDoc } from "firebase/firestore";
import { db } from './firebase'; 
import { Timestamp } from "firebase/firestore";

export default function Import() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
    };

    function iterate_data(sdata) {
        setData(sdata);
        setIsModalOpen(true); // Open the modal when the data is ready
    }

    // Convert date string to Firebase Timestamp
    function convertToTimestamp(dateString) {
        return Timestamp.fromDate(new Date(dateString));
    }

    // Transform the CSV data into the format for Firestore
    function transformData(data) {
        return data.map((item) => ({
            title: item.title,
            description: item.description,
            timestamp: convertToTimestamp(item.timestamp),
        }));
    }

    // Upload the data to Firestore
    async function import_into_firebase() {
        setIsLoading(true);
        try {
            const transformedData = transformData(data);
            // Loop through transformed data and upload each notification as a document
            for (const notification of transformedData) {
                await addDoc(collection(db, 'Notifications'), notification);
            }
            alert('Data Uploaded Successfully');
            setIsModalOpen(false); // Close the modal after successful upload
            setData([]); // Clear the data after upload
        } catch (error) {
            console.error("Error importing data: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <style>
                {`
                    .table-cell {
                        border: 1px solid #ccc;
                        padding: 8px;
                    }
                    .navbar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        background-color: #2BD0BF;
                        padding: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: start;
                        z-index: 1000;
                    }
                    .navbar img {
                        height: 50px;
                        margin-right: 10px;
                    }
                    .content {
                        padding-top: 70px;
                    }
                    .modal {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        z-index: 1050;
                    }
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 1040;
                    }
                    .confirm-button {
                        padding: 10px 40px;
                        background-color: #2BD0BF;
                        border-radius: 5px;
                        color: white;
                        cursor: pointer;
                    }
                `}
            </style>

            <nav className="navbar">
                <img src="https://res.cloudinary.com/dmzp6notl/image/upload/v1709030125/appstore_zaqedk.png" alt="Logo" />
                <label>Data Transfer</label>
            </nav>

            <div className="content">
                <div className="bg-blue-300 ml-12 mt-12 p-12">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <CSVReader
                            onFileLoaded={iterate_data}
                            parserOptions={papaparseOptions}
                        />
                    </form>
                </div>

                {isModalOpen && (
                    <>
                        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} />
                        <div className="modal">
                            <h2>Confirm Upload</h2>
                            <p>Are you sure you want to upload the data to Firestore?</p>
                            <button 
                                className="confirm-button"
                                onClick={import_into_firebase} 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Uploading...' : 'Confirm'}
                            </button>
                        </div>
                    </>
                )}

                {data.length > 0 && (
                    <div className="bg-yellow-300 ml-12 mt-12 p-12 overflow-auto">
                        <table className="text-black w-full" style={{ fontSize: '12px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th className="table-cell">Title</th>
                                    <th className="table-cell">Description</th>
                                    <th className="table-cell">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="table-cell">{item.title}</td>
                                        <td className="table-cell">{item.description}</td>
                                        <td className="table-cell">{item.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
