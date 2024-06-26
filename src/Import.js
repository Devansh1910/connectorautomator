import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from './firebase'; 
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';


export default function Import() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [setName, setSetName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [qid, setQid] = useState(''); 

    const papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
    };

    function iterate_data(sdata, fileInfo, originalFile) {
        setData(sdata);
        setQid(uuidv4()); 
        setIsModalOpen(true);
    }

    function handleSubmit(event) {
        event.preventDefault(); 
        import_into_firebase(); 
    }
    
    function handleApproval(event) {
        event.preventDefault(); 
    
        console.log('Form submitted with name:', setName);
        console.log('From date:', fromDate);
        console.log('To date:', toDate);
        console.log('Speciality selected:', speciality);
    
        setIsModalOpen(false); 
        import_into_firebase(); // This is just an example; adapt it based on actual needs
    }
    

    function transformData(data) {
        return data.map((item, index) => ({
            A: item.a,
            B: item.b,
            C: item.c,
            D: item.d,
            Image: item.image,
            Correct: item.correct_option,
            Description: item.description,
            Question: item.question,
            id: item.id,
            number: index 
        }));
    }

    async function import_into_firebase() {
        setIsLoading(true);
    
        try {
            const weeklyDocRef = doc(collection(db, 'PGupload'), 'Weekley');
            const quizCollectionRef = collection(weeklyDocRef, 'Quiz');
            const quizDocRef = doc(quizCollectionRef, qid);
    
            const transformedData = transformData(data);
            const fromDateTimestamp = Timestamp.fromDate(new Date(fromDate));
            const toDateTimestamp = Timestamp.fromDate(new Date(toDate));
    
            const quizDocument = {
                Data: transformedData,
                from: fromDateTimestamp,
                to: toDateTimestamp,
                speciality: speciality,
                title: setName,
                qid: qid,
                author: {
                    speciality: speciality,
                    uid: "UEL4k2W9IEWsqYPKqkrn",
                    username: "mymedicos admin"
                }
            };
    
            await setDoc(quizDocRef, quizDocument);
            setIsModalOpen(false);
            alert('Data Uploaded Successfully');
            setData([]);
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
                        border: 1px solid #ccc; /* Light grey border */
                        padding: 8px; /* Add some padding for content */
                    }
                    .navbar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        background-color:#2BD0BF; /* Dark background for the navbar */
                        padding: 10px 10px; /* Padding around the content */
                        display: flex;
                        align-items: center;
                        justify-content: start;
                        z-index: 1000; /* Ensure navbar is above other content */
                    }
                    .navbar img {
                        height: 50px;
                        margin-right: 10px; /* Example logo size, adjust as needed */
                    }

                    {isLoading && <div>Loading...</div>}
                    {successMessage && <div>{successMessage}</div>}

                    .#setName {
                        padding: 10px 10px;
                        margin-bottom: 20px;
                        border-radius: 4px; /* Rounded corners */
                        border: 1px solid grey; /* Sets the border color to grey */
                        width: 100%; /* Makes the input field width equal to its parent's width */
                    }
                    .content {
                        padding-top: 70px; /* Add padding to top of content to ensure it's not hidden behind the fixed navbar */
                    }
                `}
            </style>
            <nav className="navbar">
                <img src="https://res.cloudinary.com/dmzp6notl/image/upload/v1709030125/appstore_zaqedk.png" alt="Logo" />
                <label for="setName">Data Transfer</label>
                {/* Include any other navigation links or elements here */}
            </nav>
            <div className="content">
                <div className='bg-blue-300 ml-12 mt-12 p-12'>
                <form onSubmit={handleSubmit}>
                    <CSVReader
                        onFileLoaded={iterate_data}
                        parserOptions={papaparseOptions}
                    />
                </form>
            </div>
            {isModalOpen && (
                <div className="modal" 
                style=
                {{ 
                    display: 'flex',
                    justifyContent: 'center', 
                    alignItems: 'center' 
                }}>
                <div className="modal-content" 
                style={{ 
                    margin: '20px',
                    border: '1px solid #000000',
                    padding: '10px', 
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <form 
                   onSubmit={handleApproval} 
                   style={{ 
                    display: 'flex',
                    flexDirection: 'row', 
                    flexWrap: 'wrap', 
                    alignItems: 'center', 
                    }}>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', fontFamily: 'Inter', borderRadius: '5px' }}>
                            <input type="text" value={setName} 
                                onChange={e => setSetName(e.target.value)}
                                placeholder='Enter the Name of the Set' 
                                style={{ padding: '10px', borderRadius: '5px' }} 
                            />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', fontFamily: 'Inter', borderRadius: '5px' }}>
                            <input type="datetime-local" value={fromDate} 
                                onChange={e => setFromDate(e.target.value)}
                                style={{ padding: '10px', borderRadius: '5px' }}
                             />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', fontFamily: 'Inter', borderRadius: '5px' }}>
                            <input type="datetime-local" value={toDate} 
                                onChange={e => setToDate(e.target.value)}
                                style={{ padding: '10px', borderRadius: '5px' }}
                            />
                        </label>
                        <label style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            padding: '10px', 
                            fontFamily: 'Inter', 
                            borderRadius: '5px' 
                            }}>
                            <select value={speciality} 
                            onChange={e => setSpeciality(e.target.value)}
                            style={{ padding: '10px', borderRadius: '5px' }}>
                                <option value="">Select Speciality</option>
                                <option value="Anatomy">Anatomy</option>
                                <option value="Physiology">Physiology</option>
                                <option value="Biochemistry">Biochemistry</option>
                                <option value="Microbiology">Microbiology</option>
                                <option value="Pharmacology">Pharmacology</option>
                                <option value="Forensic medicine">Forensic medicine</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Surgery">Surgery</option>
                                <option value="Anaesthesia">Anaesthesia</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Orthopaedics">Orthopaedics</option>
                                <option value="Radiodiagnosis">Radiodiagnosis</option>
                                <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                                <option value="ENT">ENT</option>
                                <option value="Ophthalmology">Ophthalmology</option>
                                <option value="Social and Preventive Medicine">Social and Preventive Medicine</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Exam">Exam</option>
                                <option value="Sponsor">Sponsor</option>
                                <option value="home">home</option>
                            </select>
                        </label>
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            style={{ 
                                padding: '10px 40px', 
                                fontFamily: 'Inter', 
                                borderRadius: '5px', 
                                background: '#2BD0BF', 
                                color: isLoading ? '#000000' : '#ffffff',
                            }}>
                        {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>            
            )}
            {data.length > 0 && (
                <div className='bg-yellow-300 ml-12 mt-12 p-12 overflow-auto'>
                    <table 
                        className='text-black w-full'
                        style={{ fontSize: '12px', margin: '10px 20px', borderCollapse: 'collapse' }}
                    >
                        <thead>
                            <tr>
                                <th className="table-cell">Sno</th>
                                <th className="table-cell">Question</th>
                                <th className="table-cell">A</th>
                                <th className="table-cell">B</th>
                                <th className="table-cell">C</th>
                                <th className="table-cell">D</th>
                                <th className="table-cell">Correct</th>
                                <th className="table-cell">Description</th>
                                <th className="table-cell">ID</th>
                                <th className="table-cell">Reason A</th>
                                <th className="table-cell">Reason B</th>
                                <th className="table-cell">Reason C</th>
                                <th className="table-cell">Reason D</th>
                                <th className="table-cell">Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 25).map((item, index) => (
                                <tr key={index}>
                                    <td className="table-cell">{item.sno}</td>
                                    <td className="table-cell">{item.question}</td>
                                    <td className="table-cell">{item.a}</td>
                                    <td className="table-cell">{item.b}</td>
                                    <td className="table-cell">{item.c}</td>
                                    <td className="table-cell">{item.d}</td>
                                    <td className="table-cell">{item.correct_option}</td>
                                    <td className="table-cell">{item.description}</td>
                                    <td className="table-cell">{item.id}</td>
                                    <td className="table-cell">{item.reasona}</td>
                                    <td className="table-cell">{item.reasonb}</td>
                                    <td className="table-cell">{item.reasonc}</td>
                                    <td className="table-cell">{item.reasond}</td>
                                    <td className="table-cell">{item.image}</td>
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